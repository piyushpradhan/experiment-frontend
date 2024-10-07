import { Layout, Page, Text } from '@vercel/examples-ui'

export default function Home(): React.ReactNode {

  return (
    <Page>
      <Text variant="h1" className="mb-6">
        Microfrontends
      </Text>
    </Page>
  )
}

Home.Layout = Layout
