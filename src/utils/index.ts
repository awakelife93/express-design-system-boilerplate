import config, { Config } from "@/config";
import { ErrorStatusMessage } from "@/lib";
import _ from "lodash";
import { ObjectID } from "mongodb";
import os from "os";
export * from "./error";

export const nowMemoryPercent = (): number => {
  const totalmem = os.totalmem();
  const freemem = os.freemem();
  const memPercent = (freemem / totalmem) * 100;

  return memPercent;
};

export const healthCheckMemory = (): boolean => {
  const memoryLimit = 90;
  return nowMemoryPercent() >= memoryLimit;
};

/**
 * toObjectId
 * @description
 * hash로 이루어진 objectId로 찾아야하나, find로 통해 나온 objectId는 string으로 변환되어있음.
 * @param {string | ObjectID} value
 * @returns
 */
export const toObjectId = (_id: string | ObjectID | undefined): ObjectID => {
  if (_.isUndefined(_id)) {
    throw new Error(ErrorStatusMessage.TO_OBJECT_ID_FAIL);
  }

  return typeof _id === "string" ? new ObjectID(_id) : _id;
};

export const generateConfigLog = (): void => {
  console.log("==================================");
  console.log("*");
  console.log(
    `* start time: ${new Date().toLocaleDateString("ko", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    })}`
  );
  Object.keys(config).forEach((key) => {
    const value = config[key as keyof Config];
    if (_.isObjectLike(value)) {
      console.log(`* ${key}: `);
      console.log(value);
    } else {
      console.log(`* ${key}: ${value}`);
    }
  });
  console.log("*");
  console.log("==================================");
};
