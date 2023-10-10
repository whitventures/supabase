import { observer } from 'mobx-react-lite'

import RealtimeLayout from 'components/layouts/RealtimeLayout/RealtimeLayout'
import { NextPageWithLayout } from 'types'

const Realtime: NextPageWithLayout = () => {
  console.log('ello ra')
  return <>{/* <h1>Use this as a template for realtime pages</h1> */}</>
}

Realtime.getLayout = (page) => <RealtimeLayout title="Realtime">{page}</RealtimeLayout>

export default observer(Realtime)
