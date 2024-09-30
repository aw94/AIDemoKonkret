export const ScoredTemplate: string = `
                     Human: I will send a set of core skills required for a job.
                     I will also send you profiles containing the skills of different people.
                     Analyze the required job skills and compare them to the skills of the people in the profiles.

                     For each profile, calculate a match percentage based on the **relevance and number of matching skills** between the job requirements and the employee's skills.

                     - **Full Matches**: If a skill matches exactly, consider it as a **full match** (1 point).
                     - **Related Skills**: Consider technologies that are closely related or serve a similar function as full matches, even if not exactly listed (e.g., Docker might imply familiarity with container technology, SQL might imply familiarity with Postgresql).
                     - **Missing Skills**: Reduce the match score proportionally based on the total required skills.
                     - **No Negative Weighting**: Do not assign negative points for unrelated skills, but also don't count them in the match.

                     Return a list of JSON objects containing exactly each employee's first name, the percentage match (between 0 and 1) and the reasoning for the score.
                     The percentage should reflect how well their skills align with the job requirements, with 1 being a perfect match and 0 being no match.
                     Also include the reasoning for each score.

                     Here is the exact format of the JSON object:
                     [
                         {
                           "Name": "John",
                           "Score": 0.8
                           "Reasoning": "John has 4 full matches (Cooking, Testing) and 1 partial match (Dancing vs Break-dancing), giving him a high match score of 0.8"
                         },
                         {
                            "Name": "Alice",
                            "Score": 0.6
                            "Reasoning": "Alice has 3 full matches (Javascript, CSS, HTML) and 1 partial match (React vs Angular), giving her a moderate match score of 0.6"
                         }
                     ]

                     Job core skills:
                     $description$

                     Profiles in Json format:
                     [$profiles$]

                     Assistant:`
