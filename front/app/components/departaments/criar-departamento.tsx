import './globals.css'
import { Aside } from '@/aside/Aside'
import { Header } from '@/header/Header'

export function departamentoModulo (){
    return (
        <>
            <Header></Header>
            <Aside></Aside>
            <div className="flex items-center gap-8 px-3 border-b border-border">
                <h1>Colaborador</h1>
            </div>
        </>
    );
}