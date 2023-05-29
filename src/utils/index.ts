/* ======================
      isOneOf()
====================== */
// Used as a conditional check in if statements to determine
// if the value is one of an array of allowedValues.

export const isOneOf = (value: any, allowedValues: any[]) => {
  if (allowedValues.indexOf(value) !== -1) {
    return true
  }
  return false
}

/* ======================
      getZodErrors
====================== */
///////////////////////////////////////////////////////////////////////////
//
// Get concise Zod errors from the result of <Somechema>.safeParse(data)
//
// Usage:
//
//   const DataSchema = z.object({
//     id: z.string().nonempty(),
//     name: z.string().nonempty(),
//     email: z.string().email()
//   })
//
//   type DataType = z.infer<typeof DataSchema>
//
//   const data: DataType = {
//     id: 123,
//     name: '',
//     email: 'david@example.com'
//   }
//
//   const result = DataSchema.safeParse(data)
//
//   if (!result.success) {
//     // console.log('\n\nError issues:', result?.error?.issues)
//     const errors = getZodErrors(result?.error?.issues)
//     console.log(errors)
//   }
//
// Logs:
//
//   [
//     { name: 'id',   message: 'Expected string, received number' },
//     { name: 'name', message: 'String must contain at least 1 character(s)' }
//   ]
//
///////////////////////////////////////////////////////////////////////////

export const getZodErrors = (issues: Record<string, any>[] = []) => {
  const errors: { name: string; message: string }[] = []

  for (let i = 0; i < issues.length; i++) {
    const issue = issues[i]
    errors.push({
      name: issue.path[0],
      message: issue.message
    })
  }

  return errors
}

/* ======================
     getErrorMessage
====================== */
// This is for getting error messages in the client.

export const getErrorMessage = (
  err: Record<any, any> | null,
  fallBackMessage = 'The request failed!'
) => {
  if (err === null) {
    return fallBackMessage
  }
  return err?.response?.data?.message
    ? err?.response?.data?.message
    : err.message
    ? err.message
    : fallBackMessage
}

/* ======================
        sleep()
====================== */
// Used in API calls to test/simulate a slow call
// Example: await sleep(4000)

export const sleep = async (delay = 1000) => {
  return new Promise((resolve) => setTimeout(resolve, delay)) // eslint-disable-line
}

/* ======================
    transformToSlug()
====================== */

export const transformToSlug = (str: string) => {
  if (!str || typeof str !== 'string') {
    return str
  }

  const transformed = str
    .replaceAll(/[^a-zA-Z0-9 ]/g, '')
    .replaceAll(' ', '-')
    .toLowerCase()

  return transformed
}

/* ======================
    propInObj()
====================== */
// https://dmitripavlutin.com/check-if-object-has-property-javascript/
export const propInObj = (prop: string, obj: Record<any, any>) => {
  return prop in obj
}

/* ======================
      stripObj()
====================== */
///////////////////////////////////////////////////////////////////////////
//
// Inspired by Zod's default parsing behavior of stripping
// a raw data object of any properties not defined by the
// schema. Incidentally, Mongoose also does this against
// it's own schema. Thus, this function would generally
// not be needed, but it's a nice-to-have.
//
// This function takes in an object an an array of allowedKeys.
// It returns a NEW object with only the allowed keys. Example:
//
//   const object = { name: 'David', age: 45 }
//   const allowedKeys = ['name']
//   const strippedObject = stripObject(object, allowedKeys) // => { name: 'David' }
//
///////////////////////////////////////////////////////////////////////////

export const stripObj = <T extends object>(
  obj: T,
  allowedKeys: string[] = []
): Partial<T> => {
  const newObject = { ...obj } // shallow copy
  const keys = Object.keys(newObject)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (!allowedKeys.includes(key)) {
      delete newObject[key as keyof typeof newObject]
    }
  }

  return newObject
}

/* ======================
      docToObj()
====================== */
// This function is used to get around the Next.js serialization error that
// sometimes occurs when getting data from the database withing getServerSideProps.
// Pass a document directly to it, or if you're working with an array of documents,
// you can map over that array as follows: products.map(docToObj),
// As an alternate solution, I've also seen people do: JSON.parse(JSON.stringify(products))
//
// Another possible solution that might work entails making a deep clone:
// https://www.youtube.com/watch?v=wAj074hO_3g
export const docToObj = (doc: any) => {
  if (doc?._id) {
    doc._id = doc._id.toString()
  }

  if (doc?.createdAt) {
    doc.createdAt = doc.createdAt.toString()
  }

  if (doc?.updatedAt) {
    doc.updatedAt = doc.updatedAt.toString()
  }

  return doc
}

/* ======================
createDateFromStringValues()
====================== */
///////////////////////////////////////////////////////////////////////////
//
// Gotcha: creating dates with an ISO string results in the offset being baked into the date.
//
//   const date = new Date("1978-05-09T00:00:00Z"); // Same as: "1978-05-09"
//   => Mon May 08 1978 18:00:00 GMT-0600 (Mountain Daylight Time)
//
// Instead, ALWAYS create dates using this format: new Date(year,month,day)
//
//   const date = new Date(1978, 4, 9);
//
// The thing to remember here is that the month value is 0 indexed.
// One way to ensure this is to have a helper function:
//
///////////////////////////////////////////////////////////////////////////

export const createDateFromStringValues = (
  year: string,
  month: string,
  day: string,
  hours = '0', // type string is trivially inferred.
  minutes = '0',
  seconds = '0'
) => {
  // return early if one or more arguments is invalid.
  if (typeof year !== 'string' || year.trim() === '' || isNaN(parseInt(year))) {
    return
  }

  if (
    typeof month !== 'string' ||
    month.trim() === '' ||
    isNaN(parseInt(month))
  ) {
    return
  }

  if (typeof day !== 'string' || day.trim() === '' || isNaN(parseInt(day))) {
    return
  }

  if (
    typeof hours !== 'string' ||
    hours.trim() === '' ||
    isNaN(parseInt(hours))
  ) {
    return
  }

  if (
    typeof minutes !== 'string' ||
    minutes.trim() === '' ||
    isNaN(parseInt(minutes))
  ) {
    return
  }

  if (
    typeof seconds !== 'string' ||
    seconds.trim() === '' ||
    isNaN(parseInt(seconds))
  ) {
    return
  }

  const y = parseInt(year)
  const m = parseInt(month) - 1
  const d = parseInt(day)
  const min = parseInt(minutes)
  const s = parseInt(seconds)

  // By default, WE are setting the hours to 0, which is what it would do anyways.
  // Thus we are NOT setting it to UTC T00:00:00.000Z.
  // Instead the date will maintain a reference to local time (as offset against UTC).
  // This is NOT problematic. Rather it is intended and ideal
  const h = parseInt(hours)
  const date = new Date(y, m, d, h, min, s)

  ///////////////////////////////////////////////////////////////////////////
  //
  // Example: createDateFromStringValues('1978', '5', '9')
  //
  // console.log('date:', date) // => 1978-05-09T06:00:00.000Z
  // console.log('date.toDateString():', date.toDateString()) // => Tue May 09 1978
  // console.log('date.toLocaleDateString():', date.toLocaleDateString()) // => 5/9/1978
  // console.log('date.toLocaleString():', date.toLocaleString()) // =>  5/9/1978, 12:00:00 AM
  // console.log('date.toTimeString():', date.toTimeString()) // => 00:00:00 GMT-0600 (Mountain Daylight Time)
  // console.log('date.toLocaleTimeString():', date.toLocaleTimeString()) // => 12:00:00 AM
  // console.log('date.getHours():', date.getHours()) // => 0
  //
  ///////////////////////////////////////////////////////////////////////////
  return date
}

/* ======================
      formatDate()
====================== */

export const formatDate = (date: any) => {
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// From react-toastify
// export const isNum = (v: any): v is Number =>typeof v === 'number' && !isNaN(v);
// export const isStr = (v: any): v is String => typeof v === 'string';
// export const isFn = (v: any): v is Function => typeof v === 'function';
