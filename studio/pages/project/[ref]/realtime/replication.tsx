import { PermissionAction } from '@supabase/shared-types/out/constants'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'

import { PublicationsList, PublicationsTables } from 'components/interfaces/Database'
import RealtimeLayout from 'components/layouts/RealtimeLayout/RealtimeLayout'
import { ScaffoldContainer, ScaffoldSection } from 'components/layouts/Scaffold'
import NoPermission from 'components/ui/NoPermission'
import { useCheckPermissions, useStore } from 'hooks'
import { NextPageWithLayout } from 'types'

// copy-pasted from database/replication.tsx. This should be the new place for this page since it's
// only related to realtime replication.
const RealtimeReplication: NextPageWithLayout = () => {
  const { meta } = useStore()
  const publications = meta.publications.list()

  const canViewPublications = useCheckPermissions(
    PermissionAction.TENANT_SQL_ADMIN_READ,
    'publications'
  )

  const [selectedPublicationId, setSelectedPublicationId] = useState<number>()
  const selectedPublication = publications.find((pub) => pub.id === selectedPublicationId)

  if (!canViewPublications) {
    return <NoPermission isFullPage resourceText="view database publications" />
  }

  return (
    <ScaffoldContainer>
      <ScaffoldSection>
        <div className="col-span-12">
          <div className="mb-4">
            <h3 className="mb-1 text-xl text-scale-1200">Database Replications</h3>
          </div>
          {selectedPublicationId === undefined ? (
            <PublicationsList onSelectPublication={setSelectedPublicationId} />
          ) : (
            <PublicationsTables
              selectedPublication={selectedPublication}
              onSelectBack={() => setSelectedPublicationId(undefined)}
            />
          )}
        </div>
      </ScaffoldSection>
    </ScaffoldContainer>
  )
}

RealtimeReplication.getLayout = (page) => <RealtimeLayout title="Realtime">{page}</RealtimeLayout>

export default observer(RealtimeReplication)
