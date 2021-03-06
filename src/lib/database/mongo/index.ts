import config from "@/config";
import { createConnection } from "typeorm";
import { mongoConfig } from "../config";

const connectMongo = async (): Promise<void> => {
  await createConnection({
    ...mongoConfig[config.NODE_ENV],
    useUnifiedTopology: true,
  });
};

export default connectMongo;
