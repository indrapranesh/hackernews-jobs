import { Container } from '@/components/Container'
import axios from 'axios'
import moment from 'moment'
import Chip from '@mui/material/Chip';
import { useEffect, useState } from 'react'
import Stack from '@mui/material/Stack';

export default function Jobs() {
  const [limit, setLimit] = useState(25)
  const [offset, setOffset] = useState(1)
  const [jobs, setJobs] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [job, setJob] = useState({})
  const [search, setSearch] = useState('')
  const [tech, setTech] = useState('')

  const techStacks = [
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
    "SQL",
  ];

  const getJobs = (query, limit, offset) => {
    axios
      .get(
        `https://00gb38rlgj.execute-api.us-east-1.amazonaws.com/dev/jobs?q=${query}&limit=${limit}&offset=${offset}`
      )
      .then((response) => {
        setJobs(response.data.data)
      })
  }

  const openJob = (job) => {
    const decodedStr = job?.jobDesc?.replace(/&#x2F;/g, '/').replace(/&#x2F;/g, '/');
    // const sanitizedHTML = DOMPurify.sanitize(decodedStr);
    // console.log(job.jobDesc)
    job.jobDesc = <div dangerouslySetInnerHTML={{ __html: decodedStr }} />;
    setJob(job)
    setShowModal(true)
  }

  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  const setChip = (tech) => {
    setTech(tech);
    getJobs(tech, 25, 1)
  }

  useEffect(() => {
    getJobs('', limit, offset)
  }, [])
  return (
    <>
      <Container>
        <div class="mt-2 flex px-3">
          <input
            type="text"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Keyword, Company Name, Position, etc."
            onChange={handleSearch}
          ></input>
          <button
            type="button"
            class=" ml-3 min-w-[10%] rounded bg-indigo-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => getJobs(search, 25, 1)}
          >
            Search Jobs
          </button>
        </div>
        <div className='pt-5'>
          <Stack direction="row" spacing={1}>
            {
              techStacks.map((techStack) => <>
                <Chip className='cursor-pointer' onClick={() => setChip(techStack)} label={techStack} variant={techStack == tech ? 'filled' : 'outlined' } />
              </>)
            }
          </Stack>
          </div>

        <ul role="list" class="divide-y divide-gray-100 py-10">
          {jobs.map((job) => (
            <li className="flex justify-between py-3" key={job.id}>
              <div class="min-w-0">
                <div>
                  <p class="text-sm italic leading-6 text-gray-900">
                    {job?.company == 'Nil' || job?.company == 'N/A'
                      ? 'Startup'
                      : job?.company}
                  </p>
                </div>
                <div class="flex items-start gap-x-3">
                  <p class="text-sm font-semibold leading-6 text-gray-900">
                    {job?.title == 'No Title' ? 'Open Position' : job?.title}
                  </p>
                  {job?.tech_stack?.technologies?.map((tech, index) => (
                    <p
                      key={index}
                      class="mt-0.5 whitespace-nowrap rounded-md bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
                    >
                      {tech}
                    </p>
                  ))}
                </div>
                <div class="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                  <p class="whitespace-nowrap">
                    Posted{' '}
                    <time datetime="2023-03-17T00:00Z">
                      {moment(job?.createdAt).fromNow()}
                    </time>
                  </p>
                  <svg viewBox="0 0 2 2" class="h-0.5 w-0.5 fill-current">
                    <circle cx="1" cy="1" r="1" />
                  </svg>
                  <p class="truncate">Created by Leslie Alexander</p>
                </div>
              </div>
              <div class="flex flex-none items-center gap-x-4"  onClick={() => openJob(job)}>
                <a
                  class="cursor-pointer hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
                >
                  View Job
                </a>
              </div>
            </li>
          ))}
        </ul>
        {
          showModal ? (
            <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-6xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                  {job?.title == 'No Title' ? 'Open Position' : job?.title}
                  </h3>
                  <button
                    className="p-1 ml-auto border-0 text-black  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className=" text-black  h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                    {job?.jobDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div onClick={() => showModal(false)} className="opacity-25 fixed inset-0 z-60 bg-black"></div>
        </>
          ) : null
        }
      </Container>
    </>
  )
}
