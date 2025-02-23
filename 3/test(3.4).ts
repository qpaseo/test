// 영상 3.4
{
  type Player<E> = {
    name: string;
    extraInfo: E;
  };

  type SeoPlayer = Player<{ favFood: string }>;

  const seo: SeoPlayer = {
    name: "seo",
    extraInfo: {
      favFood: "s",
    },
  };
}
