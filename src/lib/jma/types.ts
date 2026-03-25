// 気象庁API レスポンス型定義

export type JMAForecastArea = {
    area: { name: string; code: string }
    weatherCodes: string[]
    weathers: string[]
    winds: string[]
    waves?: string[]
  }
  
  export type JMATimeSeries = {
    timeDefines: string[]
    areas: JMAForecastArea[]
  }
  
  export type JMAPopArea = {
    area: { name: string; code: string }
    pops: string[] // 降水確率(%)
  }
  
  export type JMAPopTimeSeries = {
    timeDefines: string[]
    areas: JMAPopArea[]
  }
  
  export type JMAForecastResponse = {
    publishingOffice: string
    reportDatetime: string
    timeSeries: [JMATimeSeries, JMAPopTimeSeries, ...unknown[]]
  }[]
  
  // アプリ内で使う整形済み型
  export type HourlyUVForecast = {
    time: string       // "09:00" など
    uvIndex: number    // 推定UV指数
    uvLevel: UVLevel
    weatherCode: string
    weather: string
    pop: number        // 降水確率(%)
  }
  
  export type UVLevel =
    | "低い"
    | "中程度"
    | "強い"
    | "非常に強い"
    | "極端に強い"
  
  export type UVResponse = {
    areaName: string
    reportDatetime: string
    currentUV: number
    currentLevel: UVLevel
    peakUV: number
    peakTime: string
    reapplyIntervalMin: number  // 塗り直し推奨間隔(分)
    spfRecommended: number      // 推奨SPF
    hourlyForecast: HourlyUVForecast[]
    tomorrowPeakUV: number
  }
  
  // 緯度経度 → 気象庁オフィスコードのマッピング用
  export type OfficeEntry = {
    code: string
    name: string
    lat: number
    lng: number
  }