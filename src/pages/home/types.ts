import { IAricleWithSummary } from "@pjblog/hooks"
export interface IArticle extends IAricleWithSummary {
  comments: string,
}