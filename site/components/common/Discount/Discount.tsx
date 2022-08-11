import * as React from 'react';

export interface DiscountDataResults {
    data: object | null
    path: string
}

function Discount() {
  const [data, setData] = React.useState<DiscountDataResults | null>(null)
  const [isLoading, setLoading] = React.useState(false)
  const discountPath = `${process.env.NEXT_PUBLIC_DISCOUNT_ROUTE}:${process.env.NEXT_PUBLIC_DISCOUNT_PORT}`

  function getRandomArbitrary(min: number, max:number) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  function fetchDiscount() {
      fetch(`${discountPath}/discount`,)
          .then((res) => res.json())
          .then((data) => {
              const index = getRandomArbitrary(0,data.length);
              setData(data[index])
          })
          .catch(e => console.error(e.message))
          .finally(() => {
              setLoading(false)
          })
  }

  React.useEffect(() => {
      setLoading(true)
      fetchDiscount()
  }, [data?.path])

  if (isLoading) return (
    <div className="flex flex-row justify-center h-10">
      GET FREE SHIPPING WITH DISCOUNT CODE
    </div>
  )
  if (!data) return (
    <div className="flex flex-row justify-center h-10">
      GET FREE SHIPPING WITH DISCOUNT CODE &nbsp; <b>STOREDOG</b>
    </div>
  ) 

  return (
    <div className="flex flex-row justify-center h-10">
    GET FREE SHIPPING WITH DISCOUNT CODE &nbsp; <b>{data}</b>
    </div>
  )
}

export default Discount