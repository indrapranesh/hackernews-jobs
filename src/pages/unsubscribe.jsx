import { Container } from "@/components/Container";
import { useRouter } from "next/router";
import { useEffect } from "react";


export default function Unsubscribe() {

    const router = useRouter();
    useEffect(() => {
        setTimeout(() => {
            router.replace('/')
        }, 10000)
    },[])

    return (
    <>
    <Container className="min-h-3/4 flex  justify-center">
    <h5 className="pt-24 font-display text-xl tracking-tight text-center text-slate-900 sm:text-3xl">
    We are sorry to see you go! Thank you for being a part of the Hacker Jobs community. If you ever change your mind, feel free to resubscribe anytime!
                </h5>
    </Container>
    </>
     
    )
}