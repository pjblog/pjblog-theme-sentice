export interface ICommentState {
  id: number,
  html: string,
  ip: string,
  ctime: string | Date,
  rid: number,
  user: {
    id: number,
    nickname: string,
    account: string,
    avatar: string,
    level: number,
  },
  article: {
    id: number,
    title: string,
    code: string,
  },
  replies?: ICommentState[],
}