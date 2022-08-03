import * as React from 'react';

// Advertisement banner
function Ad() {
  const [data, setData] = React.useState(null)
  const [isLoading, setLoading] = React.useState(false)

  function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  React.useEffect(() => {
    setLoading(true)
    fetch('http://localhost:7676/ads')
      .then((res) => res.json())
      .then((data) => {
        const index = getRandomArbitrary(0,data.length);
        setData(data[index])
        setLoading(false)
      })
  }, [])

  if (isLoading) return (
    <div className="flex flex-row justify-center h-10">
      AD HERE
    </div>
  )
  if (!data) return (
    <div className="flex flex-row justify-center h-10">
      AD HERE
    </div>
  ) 

  return (
    <div className="flex flex-row justify-center py-4">
      <picture>
        <source srcSet={`http://localhost:7676/banners/${data.path}`} type="image/webp" />
        <img src={`http://localhost:7676/banners/${data.path}`} alt="Landscape picture" />
      </picture>
    </div>
  )
}

export default Ad