import { SingleArticle } from "~/intefaces/Article";

export function getArticleTitle(article: SingleArticle): string {
  const header = article.components.find((el) => el.xpath.includes('h1'));
  if (header) return header.text;
  const header2 = article.components.find((el) => el.xpath.includes('h2'));
  if (header2) return header2.text;
  const any = article.components.find(() => true);
  if (any) return any.text;
  return 'Empty article... Probably there is bug in scraping. Please write to support.'
}
