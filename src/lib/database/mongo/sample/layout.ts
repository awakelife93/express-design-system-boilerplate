import { UnknownObject } from "@/lib";

type SampleLayout = {
  [index: string]: UnknownObject;
};
export const sampleLayouts: SampleLayout = {
  BLACK_THEME__CONTAINER_LAYOUT: {
    backgroundColor: "black",
  },
  BLACK_THEME__MODAL_LAYOUT: {
    border: "1px solid white",
  },
  WHITE_THEME__CONTAINER_LAYOUT: {
    backgroundColor: "white",
  },
  WHITE_THEME__MODAL_LAYOUT: {
    border: "1px solid black",
  },
  GREEN_THEME__CONTAINER_LAYOUT: {
    backgroundColor: "green",
  },
  GREEN_THEME__MODAL_LAYOUT: {
    backgroundColor: "red",
  },
};
