import { expect, it, describe } from "@jest/globals";
import { parseLinkHeader, parseSingleLink } from "~/composables/parseLinkHeader";

describe('link', () => {
  it('parsing a proper link header with next and last', () => {
    const link =
      '<https://api.github.com/user/9287/repos?client_id=1&client_secret=2&page=2&per_page=100>; rel="next", ' +
      '<https://api.github.com/user/9287/repos?client_id=1&client_secret=2&page=3&per_page=100>; rel="last"'

    const res = parseLinkHeader(link)
    expect(res).toEqual({
        next: {
          client_id: '1', client_secret: '2', page: '2', per_page: '100', rel: 'next',
          url: 'https://api.github.com/user/9287/repos?client_id=1&client_secret=2&page=2&per_page=100'
        },
        last: {
          client_id: '1', client_secret: '2', page: '3', per_page: '100', rel: 'last',
          url: 'https://api.github.com/user/9287/repos?client_id=1&client_secret=2&page=3&per_page=100'
        }
      }
    )
  })

  it('parseSingleLink', () => {
    expect(parseSingleLink('<https://api.github.com/user/9287/repos?client_id=1&client_secret=2&page=2&per_page=100>; rel="next"')).toEqual({
      url: 'https://api.github.com/user/9287/repos?client_id=1&client_secret=2&page=2&per_page=100',
      client_id: "1", client_secret: "2", page: "2", per_page: "100", rel: "next"
    })
  })

  it('relative path', () => {
    expect(parseSingleLink('</article?page=2&limit=10>; rel="next"')).toEqual({
      url: '/article?page=2&limit=10',
      page: '2', limit: '10', rel: 'next'
    })
  })
})
