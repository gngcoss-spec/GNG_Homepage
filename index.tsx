import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import SolutionsHub from './components/solutions/SolutionsHub';
import SolutionPage from './components/solutions/SolutionPage';
import { slugFromProductId } from './content/solutions';
import './index.css';

// 기존 배포 링크 보호: /#product-<slug> → /solutions/<slug>
const productHash = window.location.hash.match(/^#product-(.+)$/);
if (productHash) {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  window.location.replace(`${base}/solutions/${slugFromProductId(productHash[1])}`);
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/solutions" element={<SolutionsHub />} />
        <Route path="/solutions/:slug" element={<SolutionPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
