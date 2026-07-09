'use client';

import React, { useState } from 'react';
import { useFirebase, useCollection, useMemoFirebase, useFirebaseApp } from '@/firebase';
import { collection, query, orderBy, doc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Trash2, Plus, Image as ImageIcon, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from 'next/image';

type HomeFeature = {
  id: string;
  title: string;
  description: string;
  linkText: string;
  link: string;
  imageUrl: string;
  createdAt: { seconds: number; nanoseconds: number };
};

export function HomeFeaturesManagement() {
  const { firestore } = useFirebase();
  const firebaseApp = useFirebaseApp();
  const { toast } = useToast();
  
  const [isCreating, setIsCreating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [linkText, setLinkText] = useState('');
  const [link, setLink] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  const [featureToDelete, setFeatureToDelete] = useState<string | null>(null);

  const featuresQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'homepage-features'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: features, isLoading } = useCollection<HomeFeature>(featuresQuery);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      // Crear una URL local para la vista previa
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCreateFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !firebaseApp) return;
    
    if (!imageFile) {
        toast({
            variant: "destructive",
            title: "Falta imagen",
            description: "Por favor, selecciona una imagen para subir.",
        });
        return;
    }

    setIsCreating(true);
    setIsUploading(true);

    try {
      // 1. Subir imagen a Firebase Storage
      const storage = getStorage(firebaseApp);
      const storageRef = ref(storage, `homepage-features/${Date.now()}_${imageFile.name}`);
      
      const snapshot = await uploadBytes(storageRef, imageFile);
      const downloadURL = await getDownloadURL(snapshot.ref);

      setIsUploading(false);

      // 2. Guardar documento en Firestore
      await addDoc(collection(firestore, 'homepage-features'), {
        title,
        description,
        linkText,
        link,
        imageUrl: downloadURL,
        createdAt: serverTimestamp(),
      });
      
      toast({
        title: "Publicación creada",
        description: "La nueva tarjeta se mostrará en la página de inicio.",
      });
      
      setTitle('');
      setDescription('');
      setLinkText('');
      setLink('');
      setImageFile(null);
      setPreviewUrl('');
      // Resetear el input file si es posible, aunque al limpiar el state es suficiente.
      const fileInput = document.getElementById('imageFile') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hubo un problema al crear la publicación o subir la imagen.",
      });
      console.error(error);
      setIsUploading(false);
    } finally {
      setIsCreating(false);
    }
  };

  const confirmDelete = async () => {
    if (!firestore || !featureToDelete) return;
    const featureRef = doc(firestore, 'homepage-features', featureToDelete);
    await deleteDoc(featureRef);
    setFeatureToDelete(null);
    toast({
      title: "Publicación eliminada",
      description: "La tarjeta ha sido removida del inicio.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Añadir Nueva Sección al Inicio</CardTitle>
          <CardDescription>Sube una foto y crea una tarjeta que aparecerá en la página principal.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateFeature} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título Principal</Label>
                <Input 
                  id="title" 
                  placeholder="Ej: Nuevo Torneo de Verano" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageFile">Subir Foto / Imagen</Label>
                <Input 
                  id="imageFile" 
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkText">Texto del Botón</Label>
                <Input 
                  id="linkText" 
                  placeholder="Ej: Ver detalles" 
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link">Enlace de Destino (Link)</Label>
                <Input 
                  id="link" 
                  placeholder="Ej: /club o https://..." 
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea 
                  id="description" 
                  placeholder="Una breve descripción para invitar a los usuarios a hacer clic." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  required
                />
              </div>
            </div>
            
            {previewUrl && (
              <div className="mt-4 border rounded-md p-4 bg-muted/20">
                 <p className="text-sm font-medium mb-2">Vista previa de la imagen:</p>
                 <div className="relative w-full max-w-sm h-40 rounded-md overflow-hidden bg-black/10 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewUrl} alt="Vista previa" className="object-cover w-full h-full" />
                 </div>
              </div>
            )}

            <Button type="submit" disabled={isCreating} className="w-full md:w-auto">
              {isUploading ? <Upload className="mr-2 h-4 w-4 animate-bounce" /> : <Plus className="mr-2 h-4 w-4" />}
              {isUploading ? 'Subiendo imagen...' : isCreating ? 'Guardando...' : 'Publicar en Inicio'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Publicaciones Activas en Inicio</CardTitle>
          <CardDescription>Gestiona las tarjetas que actualmente se muestran en la página principal.</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog open={!!featureToDelete} onOpenChange={(open) => !open && setFeatureToDelete(null)}>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Imagen</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Enlace</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6">Cargando publicaciones...</TableCell>
                    </TableRow>
                  ) : (!features || features.length === 0) ? (
                    <>
                      <TableRow>
                        <TableCell colSpan={4} className="bg-muted/30 text-center py-2 text-sm text-muted-foreground">
                          Mostrando publicaciones por defecto (No se pueden eliminar). Al crear la primera, estas desaparecerán.
                        </TableCell>
                      </TableRow>
                      {[
                        { title: "Club de Competición", link: "/club", img: "club" },
                        { title: "Comunidad Exclusiva", link: "/community", img: "community" },
                        { title: "Escuela de Élite", link: "/school", img: "school" }
                      ].map((def) => (
                        <TableRow key={def.title} className="opacity-70">
                          <TableCell>
                             <div className="h-10 w-16 relative rounded overflow-hidden bg-muted flex items-center justify-center border border-dashed">
                               <span className="text-xs text-muted-foreground">{def.img}</span>
                             </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {def.title} <span className="ml-2 text-xs bg-muted px-2 py-1 rounded-full">Por defecto</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">{def.link}</span>
                          </TableCell>
                          <TableCell className="text-right">
                             <span className="text-xs text-muted-foreground">Fijo</span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  ) : (
                    features.map((feature) => (
                      <TableRow key={feature.id}>
                        <TableCell>
                           <div className="h-10 w-16 relative rounded overflow-hidden bg-muted flex items-center justify-center">
                             {/* eslint-disable-next-line @next/next/no-img-element */}
                             <img src={feature.imageUrl} alt={feature.title} className="object-cover w-full h-full" />
                           </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {feature.title}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">{feature.link}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setFeatureToDelete(feature.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar publicación?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta tarjeta dejará de mostrarse inmediatamente en la página principal.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
