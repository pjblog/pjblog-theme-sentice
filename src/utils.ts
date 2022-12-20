export interface ThemeConfigs {
  readonly logo: string,
  readonly banner: string,
  readonly bannerColor: string,
  readonly showCommentsWhenNotLogined: boolean,
}

export function numberic(defaultValue: number = 0) {
  return (value: string) => {
    if (!value) return defaultValue;
    return Number(value);
  }
}

export function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({
      behavior: 'smooth'
    })
  }
}