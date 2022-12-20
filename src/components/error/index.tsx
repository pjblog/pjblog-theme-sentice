import { PropsWithoutRef } from "react";

export function BlogError(props: PropsWithoutRef<{ error: any }>) {
  return <div>{props.error.message}</div>
}