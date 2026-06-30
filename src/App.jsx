import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastProvider } from './ui/Toast.jsx';
import Home from './pages/Home.jsx'
import LayoutApp from './ui/LayoutApp.jsx'
import NotFound from './pages/NotFound.jsx';
import ProductsProvider from './components/products/useProducts.jsx';
import Login from './pages/Login.jsx';
import ProtectedRoute from './components/authentications/ProtectedRoute.jsx';
import Category from './pages/Category.jsx';
import CategoryProvider from './components/category/useCategory.jsx';
import Colors from './pages/Colors.jsx';
import ColorsProvider from './components/colors/useColors.jsx';
import Size from './pages/Size.jsx';
import SizeProvider from './components/size/useSize.jsx';
import Products from './pages/Products.jsx';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="login" element={<Login />} />
            <Route path="/" element={<LayoutApp />}>
              <Route path='/' index element={<ProductsProvider><Home /></ProductsProvider>} />
              <Route path="category" element={<ProtectedRoute><CategoryProvider><Category /></CategoryProvider></ProtectedRoute>} />
              <Route path="colors" element={<ProtectedRoute><ColorsProvider><Colors /></ColorsProvider></ProtectedRoute>} />
              <Route path="size" element={<ProtectedRoute><SizeProvider><Size /></SizeProvider></ProtectedRoute>} />
              <Route path="products" element={<ProtectedRoute><ProductsProvider><Products /></ProductsProvider></ProtectedRoute>} />


              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  )
}

export default App




