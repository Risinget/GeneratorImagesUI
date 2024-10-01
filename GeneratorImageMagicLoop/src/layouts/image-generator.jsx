import React, { useState } from 'react';
import { Send, Download, Loader2 } from "lucide-react";
import axios from 'axios'; // Asegúrate de importar axios

// Button Component
const Button = React.forwardRef(({ className, variant, size, asChild, children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };
  const Comp = asChild ? React.Fragment : "button";
  return (
    <Comp
      className={`${baseStyles} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className}`}
      ref={ref}
      {...props}
    >
      {children}
    </Comp>
  );
});

// Input Component
const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      {...props}
    />
  );
});

// Card Component
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-lg border bg-white text-gray-800 shadow-sm ${className}`} // Ajustes aquí
    {...props}
  />
));

// Main Component
export default function Component() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const getImageUri = async (text) => {
    try {
      const url = 'generator-images-ui.vercel.app/getImageUri?input=' + encodeURIComponent(text);

      const response = await axios.get(url);
      const responseJson = response.data; // Axios ya transforma la respuesta a JSON
      // console.log('RESPONSE:', responseJson);
      // console.log('STATUS:', responseJson.status);
      // console.log('OUTPUT:', responseJson.imageUri);
      
      return responseJson.imageUri; // Asegúrate de que la estructura del objeto es correcta
    } catch (error) {
        console.error("Error fetching image:", error);
        return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Mover aquí
    setIsLoading(true);
    
    // Mostrar mensaje de "generando"
    const imageUri = await getImageUri(prompt);
    if (imageUri) {
      setImageUrl(imageUri);
    } else {
      console.error("Failed to generate image");
    }
    console.log("Prompt:", prompt);
    console.log("Image URL:", imageUri);
    
    
    setIsLoading(false);
  };

  const downloadImage = async (url) => {
    const imageUrl = btoa(url); // Asegúrate de codificar la URL aquí

    try {
      const response = await axios.get(`generator-images-ui.vercel.app/download?url=${imageUrl}`, {
        responseType: 'blob', // Importante para manejar la respuesta como un blob
      });

      // Crear un enlace de descarga
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'image.png'; // Nombre del archivo
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url); // Liberar la URL del blob
    } catch (error) {
      console.error('Error al descargar la imagen:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">AI Image Generator</h1>
        
        <div className="mb-6 aspect-square w-full bg-gray-100 rounded-lg overflow-hidden relative">
          {imageUrl ? (
            <img src={imageUrl} alt="Generated image" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              {isLoading ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                "Your image will appear here"
              )}
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Enter your prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
          
          <div className="flex justify-between">
            <Button 
              type="submit" 
              className="bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Generate
            </Button>
            
            <Button
              type="button"
              className="bg-green-500 hover:bg-green-600 text-white transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              disabled={!imageUrl}
              onClick={async () => { downloadImage(imageUrl) } }
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>

          </div>
        </form>
      </Card>
    </div>
  );
}
