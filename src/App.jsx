import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import BusinessList from "./BusinessList.jsx";
import CategoryList from "./CategoryList.jsx";
import { DataProvider } from "./Context/DataContext.jsx";
import ItemList from "./ItemList.jsx";
import Viewer3D from "./components/Viewer3D.jsx";

function AppWrapper() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname + location.search}>
      <Route path="/" element={<CategoryList />} />
      <Route path="/category/:categoryId" element={<BusinessList key={location.pathname} />} />
      <Route
        path="/category/:categoryId/business/:businessId"
        element={<ItemList key={location.pathname} />}
      />
      <Route
        path="/category/:categoryId/business/:businessId/item/:itemId"
        element={<Viewer3D key={location.pathname} />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <DataProvider>
        <AppWrapper />
      </DataProvider>
    </Router>
  );
}
