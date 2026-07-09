'use client';

import React, { useState, useMemo } from 'react';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { format, subDays, subMonths, subYears, isAfter, startOfDay, startOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { Shield, Users, Search, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type UserProfile = {
  id: string;
  displayName: string;
  email: string;
  playerId?: string;
  whatsappNumber?: string;
  createdAt: { seconds: number; nanoseconds: number };
  hasSchoolAccess?: boolean;
};

const ADMIN_EMAILS = ['jackskkclub@gmail.com', 'guillepasqui@gmail.com', 'robertemprende000@gmail.com'];

type TimeFilter = 'week' | 'month' | 'year';

export function Dashboard() {
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('month');

  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'users'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: users, isLoading } = useCollection<UserProfile>(usersQuery);

  const handleAccessChange = async (userId: string, currentAccess: boolean) => {
    if (!firestore) return;
    const userRef = doc(firestore, 'users', userId);
    try {
      await updateDoc(userRef, {
        hasSchoolAccess: !currentAccess
      });
      toast({
        title: "Permiso actualizado",
        description: `El acceso a la escuela para el usuario ha sido ${!currentAccess ? 'concedido' : 'revocado'}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el permiso.",
      });
      console.error("Error updating user access:", error);
    }
  };

  const filteredUsers = users?.filter(user => 
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.playerId?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Logic to process data for the chart based on the selected filter
  const chartData = useMemo(() => {
    if (!users) return [];
    
    const now = new Date();
    let startDate: Date;
    let formatStr: string;
    let groupByFn: (date: Date) => string;

    switch (timeFilter) {
      case 'week':
        startDate = subDays(now, 7);
        formatStr = 'EEEE'; // e.g. "lunes", "martes"
        groupByFn = (d) => format(d, 'EEEE', { locale: es });
        break;
      case 'month':
        startDate = subDays(now, 30);
        formatStr = 'dd MMM'; // e.g. "05 jul"
        groupByFn = (d) => format(d, 'dd MMM', { locale: es });
        break;
      case 'year':
        startDate = subMonths(now, 12);
        formatStr = 'MMM yyyy'; // e.g. "jul 2026"
        groupByFn = (d) => format(d, 'MMM yyyy', { locale: es });
        break;
    }

    // Filter users within the timeframe
    const recentUsers = users.filter(u => {
      if (!u.createdAt) return false;
      const date = new Date(u.createdAt.seconds * 1000);
      return isAfter(date, startDate);
    });

    // Grouping logic (Count users per bucket)
    const groupedData = recentUsers.reduce((acc, user) => {
      const date = new Date(user.createdAt.seconds * 1000);
      const key = groupByFn(date);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Ensure we show an ordered chronological array depending on filter. 
    // To make it simple and bulletproof, we generate the bucket labels from startDate to now and fill the gaps.
    const finalData = [];
    if (timeFilter === 'week' || timeFilter === 'month') {
        const daysToIterate = timeFilter === 'week' ? 7 : 30;
        for (let i = daysToIterate - 1; i >= 0; i--) {
            const date = subDays(now, i);
            const key = groupByFn(date);
            finalData.push({
                name: key,
                usuarios: groupedData[key] || 0,
            });
        }
    } else if (timeFilter === 'year') {
        for (let i = 11; i >= 0; i--) {
            const date = subMonths(now, i);
            const key = groupByFn(date);
            finalData.push({
                name: key,
                usuarios: groupedData[key] || 0,
            });
        }
    }

    return finalData;
  }, [users, timeFilter]);

  const newUsersInPeriod = chartData.reduce((acc, curr) => acc + curr.usuarios, 0);

  return (
    <div className="space-y-6">
      
      {/* Controles del Dashboard */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Análisis de Crecimiento</h2>
        <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground font-medium">Periodo:</span>
            <Select value={timeFilter} onValueChange={(value: TimeFilter) => setTimeFilter(value)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecciona un periodo" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="week">Últimos 7 días</SelectItem>
                    <SelectItem value="month">Último mes</SelectItem>
                    <SelectItem value="year">Último año</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>

      {/* Tarjetas Principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Usuarios Totales
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{users?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Jugadores registrados en toda la historia
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nuevos Registros
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{newUsersInPeriod}</div>
            <p className="text-xs text-muted-foreground mt-1">
              En el periodo seleccionado ({timeFilter === 'week' ? '7 días' : timeFilter === 'month' ? '30 días' : '1 año'})
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico Principal */}
      <Card className="pt-6">
          <CardContent>
             <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorUsuarios" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                        <XAxis 
                            dataKey="name" 
                            className="text-xs font-medium" 
                            tick={{fill: 'hsl(var(--muted-foreground))'}} 
                            tickLine={false} 
                            axisLine={false} 
                            dy={10}
                        />
                        <YAxis 
                            className="text-xs font-medium" 
                            tick={{fill: 'hsl(var(--muted-foreground))'}} 
                            tickLine={false} 
                            axisLine={false} 
                            dx={-10}
                        />
                        <Tooltip 
                            contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                            itemStyle={{ color: 'hsl(var(--primary))' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="usuarios" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorUsuarios)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
             </div>
          </CardContent>
      </Card>

      {/* Tabla de Jugadores */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión e Informes de Jugadores</CardTitle>
          <CardDescription>Visualiza y busca detalladamente todos los jugadores registrados.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por nombre, email o ID..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>ID Jugador</TableHead>
                  <TableHead>WhatsApp</TableHead>
                  <TableHead>Fecha de Registro</TableHead>
                  <TableHead>Acceso Escuela</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">Cargando usuarios...</TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">No se encontraron usuarios.</TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => {
                    const isAdmin = ADMIN_EMAILS.includes(user.email);
                    return (
                      <TableRow key={user.id} className={isAdmin ? 'bg-primary/5' : ''}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <span>{user.displayName}</span>
                            {isAdmin && <Shield className="h-4 w-4 text-primary" title="Administrador" />}
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.playerId || 'N/A'}</TableCell>
                        <TableCell>{user.whatsappNumber || 'N/A'}</TableCell>
                        <TableCell>
                          {user.createdAt ? 
                            format(new Date(user.createdAt.seconds * 1000), "d MMM, yyyy", { locale: es })
                            : 'N/A'
                          }
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={!!user.hasSchoolAccess}
                            onCheckedChange={() => handleAccessChange(user.id, !!user.hasSchoolAccess)}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
