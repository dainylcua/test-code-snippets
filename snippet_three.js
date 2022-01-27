// Snippet three: gradeSubmission
// There is a slightly more complex function, but this ties in with the other two snippets.
// This is the common pattern I follow for my other Contentful API functions for error handling.


...

export const gradeSubmission = async (subId, completed, graded, feedback) => {
  let foundSubmission
  try {
    foundSubmission = await plainClient.entry.get({
      spaceId: spaceId,
      environmentId: envirId,
      entryId: subId
    })
  } catch (error) {
    console.log('Error: Submission not found in CMS', error)
    return
  }

  try {
    foundSubmission.fields.graded["en-US"] = graded
    foundSubmission.fields["feedback"] = {
      "en-US": feedback
    }
    foundSubmission.fields["completed"] = {
      "en-US": completed
    }
  } catch (error) {
    console.log('Error setting properties', error)
    return
  }

  try {
    const updatedSubmission = await plainClient.entry.update({ 
      spaceId: spaceId,
      environmentId: envirId,
      entryId: subId 
    }, foundSubmission)
    await plainClient.entry.publish(
      {
        spaceId: spaceId,
        environmentId: envirId,
        entryId: updatedSubmission.sys.id
      }, 
      {
        sys: updatedSubmission.sys
      }
    )
  } catch (error) {
    console.log('Error updating submission', error)
    return
  }
}

...
