// Snippet one: AdminAssignment
// This is the main file I'm working on at the moment. It is a dynamically routed page which utilizes `getServerSideProps` and 3 graphQL calls
// to handle the most current data. Users can have multiple submissions with the most recent one being shown to the instructor/assistant to grade. 
// A list of all users who have not submitted the corresponding assignment are shown at the top of the page.
// User data is provided by GoogleFirebase and passed in through React's Context API. 
// Upon logging out of their account, the user can no longer view any content.

...

export const getServerSidePaths = async () => {
  const data = await getDeliverables()

  return {
    fallback: false,
    paths: data.deliverableCollection.items.map((deliverable) => ({ params: { assignment: deliverable.slug } })),
  }
}


export const getServerSideProps = async (context) => {
  const data = await getAdminDeliverable(context.params.assignment)
  const users = await getRegulars()
  const admins = await getInstructors()
  return {
    props: {
      assignment: data.deliverableCollection.items[0],
      users: users.userCollection.items,
      admins
    }
  }
}

export default function AdminAssignment({assignment, users, admins}) {
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  useEffect(() => {
    const unsubscribe = user?
    admins.userCollection.items.some((u) => u.sys.id === user.uid) ?
      setIsAdmin(true)
      :
      null
    :
    null
    return unsubscribe
  }, [user, admins])
  const [latestAssignments, setLatestAssignments] = useState([])
  const [notSubmitted, setNotSubmitted] = useState([])

  useEffect(() => {
    const uniques = {}
    const uniqueArray = assignment.submissionsCollection.items
      .sort((a,b) => b.sys.publishedAt > a.sys.publishedAt)
      .reduce((result, a) => {
        if(!uniques[a.user.displayName]) {
          uniques[a.user.displayName] = true
          result.push({
            name: a.user.displayName,
            link: a.link,
            id: a.sys.id,
            completed: a.completed,
            graded: a.graded,
            comments: a.comments
          })
        }
        return result
      }, [])
    setLatestAssignments(uniqueArray)
    setNotSubmitted(users.filter((u) => !uniqueArray.some((s) => s.name === u.displayName)))
  }, [assignment, users])

  const toggleGraded = () => {
    
  }

  const loadedAdmin = () => (
    <>
      <Header1>{assignment.title}</Header1>
      <div className="flex flex-row pb-8">
        {
          notSubmitted.length ? <span>Students who have not submitted ({notSubmitted.length}/{users.length}):&nbsp;</span> : <div>All students have submitted this assignment.</div>
        }
        {
          notSubmitted.length ? 
            notSubmitted.map((u, idx) => (
              <span key={u.sys.id}>
                {u.displayName}
                {
                  idx !== notSubmitted.length-1 ? `,` : null
                }
                &nbsp;
              </span>
              ))
            :
              null
        }
      </div>
      <div className="w-full p-4 transition-all border shadow-inner dark:shadow-neutral-900 shadow-neutral-700 md:w-full dark:text-neutral-100 border-neutral-700 dark:border-neutral-900 bg-neutral-200 dark:bg-neutral-700">
        {
          latestAssignments.length ?
          latestAssignments.map((s) => (
            <GradingCard key={s.id} submission={s} />
          ))
            :
          <div className="w-full p-4 my-4 transition-all ease-in bg-white border shadow-lg border-neutral-700 dark:border-neutral-900 dark:shadow-neutral-900 shadow-neutral-500 dark:bg-neutral-800">
            No submissions.
          </div>
        }
      </div>
    </>
  )

  return(
    <Container>
      <Head>
        <title>Dashboard</title>
        <meta name='keywords' content='general assembly, seir' />
      </Head>
      {
        user ?
          isAdmin ?
            loadedAdmin()
          :
            <LoadingPlaceholder />
      :
        <LoadingPlaceholder/>
      }
    </Container>
  )
}
  
