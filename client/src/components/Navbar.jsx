import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <>
            <div className="navbar col p-3 d-flex justify-content-between align-items-center">
                <div className='d-flex gap-5 justify-content-center align-items-center'>
                    <h3 className="fw-bold">Electrify<span className="text-success">Polls</span></h3>
                    <a href="/" className='fs-5 fw-semibold' style={{textDecoration:'none',color:'black'}}>Home</a>
                    <a href="/createPoll" className='fs-5 fw-semibold' style={{textDecoration:'none',color:'black'}}>Create poll</a>
                </div>
                <Link to='/joinRoom'><button className="btn btn-dark">Join room</button></Link>
            </div>
        </>
    )
}
