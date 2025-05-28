// src/context/RolePermissionsContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { retrieveRoleById, retrieveAllRoles } from "../config/apiStore";
import decodeToken from "../utils/decodeToken";
const RolePermissionsContext = createContext();
export const RolePermissionsProvider = ({ children }) => {
  const [rolePermissions, setRolePermissions] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const decodedToken = token ? decodeToken(token) : null;
  const roleId = decodedToken?.user?.roleId || null;
  useEffect(() => {
    const fetchPermissions = async () => {
      if (!roleId) {
        setLoading(false);
        return;
      }
      try {
        const res = await retrieveAllRoles();
        const matchedRole = res?.data?.find(role => role.defaultPermissionLevel == roleId);
        // Safely parse permissions
        const parsedPermissions = typeof matchedRole?.permissions === "string"
          ? JSON.parse(matchedRole.permissions)
          : matchedRole?.permissions;
        // Set the permissions in state
        setRolePermissions(parsedPermissions);
      } catch (err) {
        console.error("Error loading role permissions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPermissions();
  }, [roleId]);


  const resetPermissions = () => {
    setRolePermissions(null);
  };

  return (
    <RolePermissionsContext.Provider value={{ rolePermissions ,loading}}>
      {children}
    </RolePermissionsContext.Provider>
  );
};
export const useSidebarPermissions = () => useContext(RolePermissionsContext);
