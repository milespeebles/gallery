const Page =
  ({ phrase }) => {
    return (
      <div>{phrase}</div>
    )
  }

Page.getInitialProps =
  async () => {
    return { phrase: 'hello world' }
  }

export default Page
