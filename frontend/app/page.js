import Navbar from "@/components/Navbar";

export default function Home() {
    return (
        <main className='min-h-screen text--colors_default bg--default'>
            <Navbar />
            <h1 className='text-3xl font-bold underline text--colors_primary px-20 py-12'>
                This is the landing page.
            </h1>
        </main>
    );
}
