import * as React from 'react';

function Discount() {
  const [data, setData] = React.useState(null)
  const [isLoading, setLoading] = React.useState(false)

  React.useEffect(() => {
    setLoading(true)
    fetch('http://localhost:2814/discount')
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
  }, [])

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
      GET FREE SHIPPING WITH DISCOUNT CODE &nbsp; <b>{data[0]["code"]}</b>
    </div>
  )
}

export default Discount