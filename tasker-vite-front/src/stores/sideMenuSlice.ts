import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { icons } from "../base-components/Lucide";

export interface Menu {
  icon: keyof typeof icons;
  title: string;
  pathname?: string;
  subMenu?: Menu[];
  ignore?: boolean;
}

export interface SideMenuState {
  menu: Array<Menu | "divider">;
}

const initialState: SideMenuState = {
  menu: [
    {
      icon: "Home",
      title: "Dashboard",
      pathname: "/dashboard",
    },
    {
      icon: "Users",
      title: "Editors",
      pathname: "/editors",
    },
    {
      icon: "Film",
      title: "Tasks",
      subMenu: [
        {
          icon: "Activity",
          pathname: "/tasks",
          title: "Get Tasks",
        },
        {
          icon: "Activity",
          pathname: "/addtask",
          title: "Create Task",
        }
      ],
    },
  ],
};

export const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState,
  reducers: {},
});

export const selectSideMenu = (state: RootState) => state.sideMenu.menu;

export default sideMenuSlice.reducer;
