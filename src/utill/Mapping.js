export function toQueryString(params) {
    return Object.entries(params)
      .map(([key, value]) => {
        if (value && typeof value === 'object') {
          // For nested objects (e.g., sortBy), convert them to a query string format
          return Object.entries(value)
            .map(([subKey, subValue]) => `${encodeURIComponent(key)}[${encodeURIComponent(subKey)}]=${encodeURIComponent(subValue)}`)
            .join('&');
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      })
      .join('&');
  }