import RealtimeLogs from 'components/interfaces/Realtime/Inspector/Logs/LogsPreviewer'
import RealtimeLayout from 'components/layouts/RealtimeLayout/RealtimeLayout'
import { observer } from 'mobx-react-lite'
import { useRouter } from 'next/router'
import { NextPageWithLayout } from 'types'

export const LogPage: NextPageWithLayout = () => {
  const router = useRouter()
  const { ref } = router.query

  return <RealtimeLogs projectRef={ref as string} condensedLayout={true} queryType={'realtime'} />
}

LogPage.getLayout = (page) => <RealtimeLayout title="Realtime">{page}</RealtimeLayout>

export default observer(LogPage)
