import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Landing from '../pages/Landing/Landing'
import Rules from '../pages/Rules/Rules'
import Main from '../pages/Main/Main'
import About from '../pages/AboutUs/AboutUs'
import Login from '../pages/Login/Login'
import Games from '../pages/Games/Games'
import BoardGame from '../pages/BoardGame/BoardGame'
import { useEffect } from 'react'

export default function Router() {
    const location = useLocation();
    useEffect(() => {
        if (location.pathname.split("/")[1] != "games" && window.intervalList) {
            for (let id of window.intervalList) {
                clearInterval(id);
            }
        }
    }, [location]);
    return (
        <Routes>
            <Route path={'/'} element={<Landing/>}/>
            <Route path={'/rules'} element={<Rules/>}/>
            <Route path={'/principal'} element={<Main/>}/>
            <Route path={'/about'} element={<About/>}/>
            <Route path={'/login'} element={<Login/>}/>
            <Route path={'/games'} element={<Games/>}></Route>
            <Route path={'/games/:gameId'} element={<BoardGame/>}></Route>
        </Routes> 
    )
}