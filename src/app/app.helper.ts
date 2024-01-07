import moment from "moment/moment";
import {
  TPaginateArgs,
  TPaginateQuery,
  TPaginateResult,
  TSendResponse,
} from "./app.types";
import { Request } from "express";
export const sendResponse: TSendResponse = (res, status, data = null) => {
  if (!Boolean(data)) {
    res.sendStatus(status);
  } else {
    res.status(status).send(data);
  }
};

export const serverDateTime = moment(new Date()).format(
  "YYYY-MM-DD hh:mm:ss A"
);

export const Log = (...args: [] | any[] | any) => {
  console.log("START LOG >>", serverDateTime, ...args, "<< END LOG");
};

export const queryPaginate: TPaginateQuery = ({ query }) => {
  const {
    page = 1,
    limit = 100,
    order_by = "updatedAt",
    sort_by = "DESC",
  } = query;
  const offset = (+page - 1) * +limit;
  const order = [[order_by, sort_by]];
  const paginateresult: TPaginateResult = { offset, limit, order };
  if (!order_by || !sort_by) {
    delete paginateresult.order;
  }
  return paginateresult;
};
