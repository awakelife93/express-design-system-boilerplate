import {
  AppRepository,
  CommonStatusCode,
  CommonStatusMessage,
  getErrorItems,
  onFailureHandler
} from "@/lib";
import { CommonPromiseAPIResponseType } from "@/lib/type";
import { QueryType } from "@/models/Common/type";
import { toObjectId } from "@/utils";
import * as _ from "lodash";
import { ObjectId } from "mongodb";
import { Component } from "../entity";
import { ComponentRequestType } from "../type";

export const findComponentCount = async (): CommonPromiseAPIResponseType<String> => {
  try {
    return String(await AppRepository.Component.count());
  } catch (error: unknown) {
    const _error = getErrorItems(error);

    onFailureHandler({
      status: _error.status,
      message: _error.message,
      data: _error.data,
    });
  }
};

export const findOneComponent = async (
  conditions: Partial<ComponentRequestType>
): CommonPromiseAPIResponseType<Component> => {
  try {
    return await AppRepository.Component.findOne({ ...conditions });
  } catch (error: unknown) {
    const _error = getErrorItems(error);

    onFailureHandler({
      status: _error.status,
      message: _error.message,
      data: _error.data,
    });
  }
};

export const findComponent = async (
  conditions: Partial<ComponentRequestType>
): CommonPromiseAPIResponseType<[Component[], number]> => {
  try {
    let query = {} as QueryType;

    if (!_.isUndefined(conditions.searchKeyword)) {
      query.where = {
        name: {
          $regex: conditions.searchKeyword,
          $options: "i",
        },
      };
    }

    if (!_.isUndefined(conditions.nameSort)) {
      query.order.name = conditions.nameSort;
    }

    return await AppRepository.Component.findAndCount({
      ...conditions,
      ...query,
    });
  } catch (error: unknown) {
    const _error = getErrorItems(error);

    onFailureHandler({
      status: _error.status,
      message: _error.message,
      data: _error.data,
    });
  }
};

export const createComponent = async (
  conditions: Component
): CommonPromiseAPIResponseType<Component> => {
  try {
    return await AppRepository.Component.create(conditions);
  } catch (error: unknown) {
    const _error = getErrorItems(error);

    onFailureHandler({
      status: _error.status,
      message: _error.message,
      data: _error.data,
    });
  }
};

export const updateComponent = async (
  conditions: Partial<Component>
): CommonPromiseAPIResponseType<Component> => {
  try {
    const component = await findOneComponent({
      _id: toObjectId(conditions._id) as ObjectId,
    }) as Component;

    if (_.isUndefined(component)) {
      onFailureHandler({
        status: CommonStatusCode.NOT_FOUND,
        message: CommonStatusMessage.NOT_FOUND,
      });
    }

    // 컴포넌트 이름
    component.name = _.isUndefined(conditions.name)
      ? component.name
      : conditions.name;
    // 컴포넌트 CSS 속성
    component.attribute = _.isUndefined(conditions.attribute)
      ? component.attribute
      : conditions.attribute;
    // 삭제 유무
    component.isDeleted = _.isUndefined(conditions.isDeleted)
      ? component.isDeleted
      : conditions.isDeleted;

    return await AppRepository.Component.save(component);
  } catch (error: unknown) {
    const _error = getErrorItems(error);

    onFailureHandler({
      status: _error.status,
      message: _error.message,
      data: _error.data,
    });
  }
};

export const removeComponent = async (
  conditions: Partial<Component>
): CommonPromiseAPIResponseType<object> => {
  try {
    await updateComponent({ _id: conditions._id, isDeleted: true });
    return {};
  } catch (error: unknown) {
    const _error = getErrorItems(error);

    onFailureHandler({
      status: _error.status,
      message: _error.message,
      data: _error.data,
    });
  }
};
