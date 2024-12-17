"use client";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";

export const createSuperAdmin = async () => {
  try {
    // Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      "admin@hombresdeblanco.com",
      "123456"
    );

    // Datos del SuperAdmin
    const superAdminData = {
      uid: userCredential.user.uid,
      email: "admin@hombresdeblanco.com",
      username: "SuperAdmin",
      role: "super_admin",
      displayName: "Super Administrador",
      permissions: {
        fullAccess: true,
        allChatsEnabled: true,
        canModerate: true,
        isAdmin: true,
        isSuperAdmin: true
      },
      createdAt: new Date().toISOString()
    };

    // Guardar en Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), superAdminData);

    return superAdminData;

  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log("SuperAdmin ya existe");
      return null;
    }
    console.error("Error creando SuperAdmin:", error);
    throw error;
  }
};

// Función para verificar si un usuario es SuperAdmin
export const isSuperAdmin = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    return userDoc.exists() && userDoc.data().role === "super_admin";
  } catch (error) {
    return false;
  }
};

// Función para obtener los permisos del SuperAdmin
export const getSuperAdminPermissions = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (userData.role === "super_admin") {
        return userData.permissions;
      }
    }
    return null;
  } catch (error) {
    console.error("Error obteniendo permisos:", error);
    return null;
  }
}; 