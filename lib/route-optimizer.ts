interface Stop { lat: number; lng: number; label?: string }

function haversineMi(a: Stop, b: Stop) {
  const R = 3959
  const dLat = (b.lat - a.lat) * Math.PI / 180
  const dLng = (b.lng - a.lng) * Math.PI / 180
  const aa = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa))
}

export function optimizeRoute(stops: Stop[]): Stop[] {
  if (stops.length < 3) return stops
  const unvisited = [...stops]
  const route: Stop[] = [unvisited.shift()!]
  while (unvisited.length > 0) {
    const last = route[route.length - 1]
    let nearestIdx = 0; let nearestDist = Infinity
    unvisited.forEach((stop, i) => {
      const dist = haversineMi(last, stop)
      if (dist < nearestDist) { nearestDist = dist; nearestIdx = i }
    })
    route.push(unvisited.splice(nearestIdx, 1)[0])
  }
  return route
}

export function totalRouteDistance(stops: Stop[]): number {
  let dist = 0
  for (let i = 1; i < stops.length; i++) dist += haversineMi(stops[i - 1], stops[i])
  return dist
}
