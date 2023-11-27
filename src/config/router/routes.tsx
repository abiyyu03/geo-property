import { createBrowserRouter } from 'react-router-dom';
import AddPropertyLayout from '../../layout/AddPropertyLayout';
import HomeLayout from '../../layout/HomeLayout';
import SearchLayout from '../../layout/SearchLayout';
import AboutAddPropertyPage from '../../pages/AboutAddPropertyPage';
import AddContactProperty from '../../pages/AddContactPropertyPage';
import AddImagePropertyPage from '../../pages/AddImagePropertyPage';
import AddPropertyPage from '../../pages/AddPropertyPage';
import DetailAddPropertyPage from '../../pages/DetailAddPropertyPage';
import DetailPage from '../../pages/DetailPage';
import HomePage from '../../pages/HomePage';
import SearchPage from '../../pages/SearchPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
  {
    path: '/search',
    element: <SearchLayout />,
    children: [
      {
        index: true,
        element: <SearchPage />,
      },
      {
        path: 'detail/:id',
        element: <DetailPage />,
      },
    ],
  },
  {
    path: '/add-property',
    element: <AddPropertyLayout />,
    children: [
      {
        index: true,
        element: <AddPropertyPage />,
      },
      {
        path: 'about-property',
        element: <AboutAddPropertyPage />,
      },
      {
        path: 'detail-property',
        element: <DetailAddPropertyPage />,
      },
      {
        path: 'contact-property',
        element: <AddContactProperty />,
      },
      {
        path: 'image-property',
        element: <AddImagePropertyPage />,
      },
    ],
  },
]);

export default router;
