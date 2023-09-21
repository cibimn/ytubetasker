import { useRoutes } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Home from "../pages/home";
import Dashboard from "../pages/Dashboard";
import SideMenu from "../layouts/SideMenu";

function Router() {
  const routes = [
    {
      element: <SideMenu />,
      children:[
        {
          path:"/dashboard",
          element:<Dashboard />
        },
        
      ]
    },
    {
      path:"/",
      element:<Home />
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    
    
  ];

  return useRoutes(routes);
}

export default Router;
