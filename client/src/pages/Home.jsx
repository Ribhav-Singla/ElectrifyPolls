import {Link} from 'react-router-dom'
export default function Home(){
    return (
        <>
        <div className="mt-5 d-flex flex-column gap-3 justify-content-center align-items-center">
            <h3 className="fw-bold">Create instant, real-time polls for work</h3>
            <Link to='/createPoll'><button className="btn" style={{background:'#3bbd6c',color:'white'}}>Create your Poll</button></Link>
        </div>
        </>
    )
}