import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { PageLoader } from './components/PageLoader';
import { CompressorPage } from './pages/CompressorPage';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';

const BackgroundRemoverPage = lazy(() => import('./pages/BackgroundRemoverPage'));
const ResizePage = lazy(() => import('./pages/ResizePage'));
const CropPage = lazy(() => import('./pages/CropPage'));
const MetadataPage = lazy(() => import('./pages/MetadataPage'));

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/comprimir-imagen" element={<CompressorPage key="comprimir" />} />
          <Route path="/eliminar-fondo" element={<BackgroundRemoverPage />} />
          <Route path="/convertir-imagen" element={<CompressorPage key="convertir" mode="convert" />} />
          <Route path="/redimensionar-imagen" element={<ResizePage />} />
          <Route path="/recortar-imagen" element={<CropPage />} />
          <Route path="/quitar-metadatos" element={<MetadataPage />} />
          <Route path="/privacidad" element={<PrivacyPage />} />
          <Route path="/terminos" element={<TermsPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
