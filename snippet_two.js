// Snippet two: GradingCard
// These cards are utilized in the AdminAssignment page to see every submission. I am currently planning on adding a filter toggle that will allow 
// instructors to only show submissions which have not been graded.
// Each submission has conditional text to assist instructors in understanding which submissions are graded/completed. Additionally, instructors
// can provide feedback in Markdown format - I plan to improve this in the future by using a Markdown parser for a real-time codeblock view.

...

const GradingCard = ({submission}) => {
  const router = useRouter()
  const [formState, setFormState] = useState({
    completed: false,
    graded: false,
    feedback: ""
  })

  useEffect(() => {
    setFormState({
      completed: submission.completed ? submission.completed : false,
      graded: submission.graded ? submission.graded : false,
      feedback: submission.feedback ? submission.feedback : ''
    })
  }, [submission])

  const onSubmit = async (e) => {
    e.preventDefault()
    const button = document.querySelector(`#submitButton-${submission.id}`)
    button.setAttribute('disabled', true)
    await gradeSubmission(submission.id, formState.completed, formState.graded, formState.feedback)
    button.removeAttribute('disabled')
    router.reload(window.location.pathname)
  }

  const handleClick = (e) => {
    const bool = !!e.target.value
    setFormState((prev) => ({
      ...prev, 
      [e.target.name]: bool
    }))
  }

  const handleChange = (e) => {
    setFormState((prev) => ({
      ...prev, 
      [e.target.name]: e.target.value
    }))
  }
  
  return (
    <div className="flex flex-col w-full p-4 my-4 transition-all ease-in bg-white border shadow-lg border-neutral-700 dark:border-neutral-900 dark:shadow-neutral-900 shadow-neutral-500 dark:bg-neutral-800">
      <div className="flex flex-row items-center justify-between pb-2">
        <a
          className="text-3xl font-medium text-red-500 underline w-fit hover:text-red-300 visited:text-red-600" 
          href={submission.link} 
          target="_blank" 
          rel="noreferrer noopener"
        >
          {submission.name}
        </a>
        <div className="flex flex-col">
          <span className={submission.graded ? 'block dark:text-green-500 text-green-700' : 'hidden'}>
            Marked Graded
          </span>
          <span className={submission.completed ? 'block dark:text-green-500 text-green-700' : 'hidden'}>
            Marked Complete
          </span>
        </div>
      </div>
      <label htmlFor="comments" className="flex flex-col pb-2">
        Comments:
        <textarea 
          className="p-2 transition-all border outline-none disabled:cursor-not-allowed bg-neutral-100 dark:bg-neutral-500 border-neutral-900 disabled:opacity-50" 
          disabled 
          name="comments"
          value={submission.comments ? submission.comments : 'NO COMMENTS SUBMITTED'} />
      </label>
      <form onSubmit={onSubmit} key={submission.id} className="flex flex-col">
        <div className="flex flex-row justify-evenly">
          <div className="flex flex-col">
            Graded:
            <label htmlFor="graded_yes" className="flex flex-row items-center ml-2">
              <input
                className="w-4 h-4 mr-1 transition-all border rounded-full appearance-none dark:border-neutral-50 border-neutral-900 checked:bg-red-500 checked:ring-1 hover:ring-1 ring-red-500 focus:ring-1" 
                type="radio" 
                name="graded" 
                id="graded_yes" 
                value="true"
                onClick={handleClick}
                required />
              Yes
            </label>
            <label htmlFor="graded_no" className="flex flex-row items-center ml-2">
              <input
                className="w-4 h-4 mr-1 transition-all border rounded-full appearance-none dark:border-neutral-50 border-neutral-900 checked:bg-red-500 checked:ring-1 hover:ring-1 ring-red-500 focus:ring-1"
                type="radio" 
                name="graded" 
                id="graded_no" 
                value=""
                onClick={handleClick} />
              No
            </label>
          </div>
          <div className="flex flex-col">
            Completed:
            <label htmlFor="completed_yes" className="flex flex-row items-center ml-2">
              <input 
                className="w-4 h-4 mr-1 transition-all border rounded-full appearance-none dark:border-neutral-50 border-neutral-900 checked:bg-red-500 checked:ring-1 hover:ring-1 ring-red-500 focus:ring-1"
                type="radio" 
                name="completed" 
                id="completed_yes" 
                value="true"
                onClick={handleClick}
                required />
              Yes
            </label>
            <label htmlFor="completed_no" className="flex flex-row items-center ml-2">
              <input 
                className="w-4 h-4 mr-1 transition-all border rounded-full appearance-none dark:border-neutral-50 border-neutral-900 checked:bg-red-500 checked:ring-1 hover:ring-1 ring-red-500 focus:ring-1"
                type="radio" 
                name="completed" 
                id="completed_no" 
                value=""
                onClick={handleClick} />
              No
            </label>
          </div>
        </div>
        <label className="flex flex-col pb-4">
          Feedback:
          <textarea
          className="p-2 transition-all bg-white border outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 dark:bg-neutral-500 border-neutral-900" 
          onChange={handleChange} 
          type="text" 
          name="feedback" 
          value={formState.feedback} />
        </label>
        <input 
          className="w-full p-2 font-bold transition-colors ease-in bg-red-500 border-2 border-red-500 cursor-pointer disabled:opacity-50 text-neutral-100 disabled:hover:bg-red-500 disabled:cursor-default disabled:hover:text-neutral-100 hover:bg-transparent hover:text-red-500"
          type="submit" 
          value="Submit Changes"
          id={`submitButton-${submission.id}`} />
      </form>
    </div>
  )
}

export default GradingCard

...
