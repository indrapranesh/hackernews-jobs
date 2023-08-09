import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { Chip, Stack } from '@mui/material'
import axios from 'axios'
import { useEffect } from 'react'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import XLogo from '@/images/logos/xlogo.svg'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function Express() {
  const [currentStep, setCurrentStep] = useState('')
  const [file, setFile] = useState('')
  const [fileUploading, setFileUploading] = useState(false)
  const router = useRouter();
  const [steps, setSteps] = useState([
    {
      name: 'Upload your Resume',
      completed: false,
    },
    {
      name: 'Review your details',
      completed: false,
    },
    {
      name: 'Subscribe to Hacker News Express',
      completed: false,
    },
  ])
  const [formDetails, setFormDetails] = useState({
    company: '',
    experience: 0,
    fullName: '',
    role: '',
    email: '',
    techStacks: [],
  });

  const [technologies, setTechnologies] = useState([
    "Python",
    "JavaScript",
    "Java",
    "Angular",
    "Go (Golang)",
    "Ruby on Rails",
    "React",
    "Node.js",
    "Git",
    "Docker",
    "AWS",
    "SQL"
  ]);

  const changeFile = (e) => {
    setFile(e.target.files[0])
  }

  const addTech = (tech) => {
    let updatedTech = formDetails.techStacks
    updatedTech.push(tech);
    console.log(updatedTech);
    console.log({
        ...formDetails,
        techStacks: updatedTech,
      })
      setFormDetails({
        ...formDetails,
        techStacks: updatedTech,
      })
  }

  const [subscribing, setSubscribing] = useState(false)
  const subscribe = () => {
    setSubscribing(true)
    axios.post(`https://00gb38rlgj.execute-api.us-east-1.amazonaws.com/dev/newsletter`, formDetails)
    .then((res) => {
        updateSteps('Subscribe to Hacker News Express', 'Subscribed')
        setSubscribing(false);
        setTimeout(() => {
            router.replace('/')
        }, 3000)
    })
    .catch((err) => {
        console.log(err)
    })
  }

  const handleTechStackDelete = (techStack) => {
    let updatedTech = formDetails.techStacks.filter(
      (tech) => tech !== techStack
    )
    setFormDetails({
      ...formDetails,
      techStacks: updatedTech,
    })
  }

  const checkStatus = async (jobId) => {
    const statusResponse = await axios.get(
      `https://00gb38rlgj.execute-api.us-east-1.amazonaws.com/dev/resume/parse?jobId=${jobId}`
    )
    if (statusResponse.data.data.status === 'IN_PROGRESS') {
      return checkStatus(jobId)
    } else if (statusResponse.data.data.status === 'SUCCEEDED') {
      const metaDataResp = await axios.get(
        `https://00gb38rlgj.execute-api.us-east-1.amazonaws.com/dev/resume/meta?resumeId=${jobId}`
      )
      console.log(metaDataResp.data)
      let metaData = metaDataResp.data.data
      setFormDetails({
        company: metaData?.company || '',
        experience: metaData?.experience,
        fullName: metaData?.fullName || '',
        role: metaData?.role || '',
        techStacks: metaData?.techStacks || [],
      })
      setFileUploading(false)
      updateSteps('Upload your Resume', 'Review your details')
    }
  }

  const updateSteps = (currentStep, nextStep) => {
    let updatedSteps = steps.map((step) => {
        if (step.name === currentStep) {
          return {
            ...step,
            completed: true,
          }
        } else return step
      })
      setSteps(updatedSteps)
      setCurrentStep(nextStep)
  }

  const submitFile = (e) => {
    // submitting logic
    setFileUploading(true)
    let fileName = `${uuidv4()}-${file.name}`
    axios
      .get(
        `https://00gb38rlgj.execute-api.us-east-1.amazonaws.com/dev/presign/s3?fileName=${fileName}`
      )
      .then((response) => {
        let uploadUrl = response.data.url
        axios
          .put(uploadUrl, file)
          .then((res) => {
            axios
              .post(
                `https://00gb38rlgj.execute-api.us-east-1.amazonaws.com/dev/resume/parse`,
                {
                  resumeId: fileName,
                }
              )
              .then((result) => {
                let jobId = result.data.data.JobId
                checkStatus(jobId)
              })
          })
          .catch((err) => {
            setFileUploading(false)
            console.log(err)
          })
      })
      .catch((err) => {
        setFileUploading(false)
        console.log(err)
      })
  }

  const submitDetails = () => {
    updateSteps('Review your details', 'Subscribe to Hacker News Express')
  }

  useEffect(() => {
    setCurrentStep('Upload your Resume');
  }, [])

  return (
    <nav aria-label="Progress" className="min-h-3/4 py-10">
      <ol
        role="list"
        class="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0"
      >
        {steps.map((step, index) => (
          <li class="relative md:flex md:flex-1" key="index">
            {/* <!-- Completed Step --> */}
            <a href="#" class="group flex w-full items-center">
              <span class="flex items-center px-6 py-4 text-sm font-medium">
                {step.completed && (
                  <span class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 group-hover:bg-indigo-800">
                    <svg
                      class="h-6 w-6 text-white"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </span>
                )}
                {!step.completed && (
                  <span class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-indigo-600">
                    <span class="text-indigo-600">{index + 1}</span>
                  </span>
                )}
                <span class="ml-4 text-sm font-medium text-gray-900">
                  {step.name}
                </span>
              </span>
            </a>
            {/* <!-- Arrow separator for lg screens and up --> */}
            {steps.length > index + 1 && (
              <div
                class="absolute right-0 top-0 hidden h-full w-5 md:block"
                aria-hidden="true"
              >
                <svg
                  class="h-full w-full text-gray-300"
                  viewBox="0 0 22 80"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 -2L20 40L0 82"
                    vector-effect="non-scaling-stroke"
                    stroke="currentcolor"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            )}
          </li>
        ))}
      </ol>

      {/* Section Contect */}
      <div>
        <Container className="pt-10">
          <div className="flex flex-col items-center">
            {currentStep === 'Upload your Resume' && (
              <>
                <h5 className="font-display text-xl tracking-tight text-slate-900 sm:text-3xl">
                  Your First Step to Success - Upload Your Resume Now!
                </h5>

                <div class="w-full pt-10">
                  <label class="flex h-72 w-full cursor-pointer appearance-none justify-center rounded-md border-2 border-dashed border-gray-300 bg-white px-4 transition hover:border-gray-400 focus:outline-none">
                    <span class="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <span class="font-medium text-gray-600">
                        Drop files to Attach, or
                        <span class="text-blue-600 underline">browse</span>
                      </span>
                    </span>
                    <input
                      onChange={changeFile}
                      type="file"
                      name="file_upload"
                      class="hidden"
                      accept=".pdf"
                    />
                  </label>

                  <div className="text-md pt-3 font-display tracking-tight text-slate-900 sm:text-lg">
                    <p className="text-center">{file?.name}</p>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      class=" ml-3 min-w-[10%] rounded bg-indigo-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onClick={() => submitFile()}
                      disabled={fileUploading}
                    >
                      {
                        fileUploading && (
                          <svg aria-hidden="true" role="status" class="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"></path>
                            </svg>
                        )
                      }
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}

            {currentStep === 'Review your details' && (
              <>
                <h5 className="font-display text-xl tracking-tight text-slate-900 sm:text-3xl">
                  Attention to Detail Matters - Review Your Profile.
                </h5>

                <div class="w-full pt-10">
                  <form>
                    <div class="space-y-12">
                      <div class="border-b border-gray-900/10 pb-12">
                        <h2 class="text-base font-semibold leading-7 text-gray-900">
                          Profile
                        </h2>
                        <p class="mt-1 text-sm leading-6 text-gray-600">
                          This information will be used for the personalized
                          newsletter.
                        </p>

                        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                          <div class="sm:col-span-4">
                            <label
                              for="fullname"
                              class="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Full name
                            </label>
                            <div class="mt-2">
                              <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                <input
                                  value={formDetails?.fullName}
                                  onChange={(e) =>
                                    setFormDetails({
                                        ...formDetails,
                                      fullName: e.target.value
                                    })
                                  }
                                  type="text"
                                  name="fullname"
                                  id="fullname"
                                  autocomplete="fullname"
                                  class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                  placeholder="Full name"
                                />
                              </div>
                            </div>
                          </div>

                          <div class="sm:col-span-4">
                            <label
                              for="experience"
                              class="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Experience
                            </label>
                            <div class="mt-2">
                              <div class="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                <input
                                  value={formDetails?.experience}
                                  onChange={(e) =>
                                    setFormDetails({
                                        ...formDetails,
                                      experience: e.target.value
                                    })
                                  }
                                  type="number"
                                  name="experience"
                                  id="experience"
                                  autocomplete="experience"
                                  class="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                  placeholder="Years of Experience"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                          <div class="sm:col-span-3">
                            <label
                              for="company"
                              class="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Current company
                            </label>
                            <div class="mt-2">
                              <input
                                value={formDetails?.company}
                                onChange={(e) =>
                                  setFormDetails({
                                    ...formDetails,
                                    company: e.target.value
                                  })
                                }
                                type="text"
                                name="company"
                                id="company"
                                autocomplete="given-name"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>

                          <div class="sm:col-span-3">
                            <label
                              for="role"
                              class="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Role
                            </label>
                            <div class="mt-2">
                              <input
                                value={formDetails?.role}
                                onChange={(e) =>
                                  setFormDetails({
                                    ...formDetails,
                                    role: e.target.value
                                  })
                                }
                                type="text"
                                name="role"
                                id="role"
                                autocomplete="family-name"
                                class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="pt-5">
                          <label
                            for="role"
                            class="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Technologies
                          </label>
                          <Stack className="pt-3" direction="row" spacing={1}>
                            {formDetails.techStacks?.map((techStack, index) => (
                              <>
                                <Chip
                                key={index}
                                  label={techStack}
                                  className="cursor-pointer"
                                  variant="filled"
                                  onDelete={() =>
                                    handleTechStackDelete(techStack)
                                  }
                                />
                              </>
                            ))}
                          </Stack>
                        </div>


                        <div className="pt-5">
                          <label
                            for="role"
                            class="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Other Popular Technologies
                          </label>
                          <Stack className="pt-3" direction="row" spacing={1}>
                            { 
                                technologies.filter(technolgy => !formDetails?.techStacks?.includes(technolgy))
                                .map((techStack, index) => (
                              <>
                                <Chip
                                    key={index}
                                  label={techStack}
                                  className="cursor-pointer"
                                  variant="filled"
                                  onClick={() => addTech(techStack)}
                                />
                              </>
                            ))}
                          </Stack>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-5">
                      <button
                        type="button"
                        class=" ml-3 min-w-[10%] rounded bg-indigo-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={() => submitDetails()}
                      >
                        Next
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
            {currentStep === 'Subscribe to Hacker News Express' && (
              <>
                <h5 className="font-display text-xl tracking-tight text-slate-900 sm:text-3xl">
                 One Last Step - Subscribe to our exclusive newsletter
                </h5>
                    <div class="bg-white py-16 sm:py-24 lg:py-32">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="max-w-lg text-lg font-bold tracking-tight text-gray-900 sm:text-4xl">
      <h2 class="inline sm:block">Join us today! </h2>
      <p class="inline sm:block">Simply enter your email address below and hit the subscribe button.</p>
    </div>
    <form class="mt-10 max-w-md">
      <div class="flex gap-x-4">
        <label for="email-address" class="sr-only">Email address</label>
        <input
                                  value={formDetails.email}
                                  onChange={(e) =>
                                    setFormDetails({
                                        ...formDetails,
                                      email: e.target.value
                                    })
                                  }
                                  type="text"
                                  name="email"
                                  id="email"
                                  autocomplete="email"
                                  class="min-w-0 flex-auto rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                  placeholder="Enter your email"
                                />
        <button type='button' onClick={subscribe} class="flex-none rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          {
            subscribing && (
              <svg aria-hidden="true" role="status" class="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"></path>
                            </svg>
            )
          }
          Subscribe</button>
      </div>
      <p class="mt-4 text-sm leading-6 text-gray-900">We care about your data. Read our <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">privacy&nbsp;policy</a>.</p>
    </form>
  </div>
</div>
            </>)
            }

            {currentStep === 'Subscribed'  && (
                <>
                <h5 className="font-display text-xl tracking-tight text-slate-900 sm:text-3xl">
                    Welcome Aboard! Hold tight and wait for our personalized newsletter from,
                </h5>

                <Image className='pt-24' height={50} src={XLogo} alt='xlogo' />

                <p className='pt-10'>Redirecting to Home page.....</p>
                </>
            )
            }
          </div>
        </Container>
      </div>
    </nav>
  )
}
