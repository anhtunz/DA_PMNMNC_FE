const cookieStorage = {
  getItem: (name: string): string | null => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? decodeURIComponent(match[2]) : null
  },
  setItem: (name: string, value: string) => {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=86400`
  },
  removeItem: (name: string) => {
    document.cookie = `${name}=; Max-Age=0; path=/`
  }
}
export default cookieStorage
