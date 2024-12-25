import MobileNavigationItem from "@/lib/components/mobileNavigationItem";
import {
    Home,
    ShoppingCart,
    FileText,
    ChartNoAxesGantt,
    Grid,
    Package,
    FilePlus,
} from 'lucide-react';
import {useUser} from "@/lib/hooks/userContext";
import {useState} from "react";

export default function MobileNavigation() {
    const {state} = useUser();
    const isAdmin: boolean = state.role === "admin";

    const [isManagerListVisible, setIsManagerListVisible] = useState(false);

    const toggleManagerList = () => {
        setIsManagerListVisible(prev => !prev);
    };

    return (
        <>
            {/*<div className="fixed top-0 border-b border-black w-full px-5 py-4 bg-white">*/}
            {/*  <div className="flex items-center justify-center">*/}
            {/*    <Image*/}
            {/*      src="/logo-with-name.png"*/}
            {/*      alt=""*/}
            {/*      className="h-7 w-auto"*/}
            {/*      width={200}*/}
            {/*      height={200}*/}
            {/*    />*/}

            {/*    <div className="flex-grow"></div>*/}

            {/*    <a href="/profile" aria-hidden="true">*/}
            {/*      <Image*/}
            {/*        src="/avatar.png"*/}
            {/*        alt=""*/}
            {/*        className="border border-black rounded-xl h-10 w-auto"*/}
            {/*        width={200}*/}
            {/*        height={200}*/}
            {/*      />*/}
            {/*    </a>*/}
            {/*  </div>*/}
            {/*</div>*/}

            <div className="fixed bottom-0 border-t border-black w-full rounded-t-3xl grid grid-cols-4 p-3 bg-stone-100">
                <MobileNavigationItem href="/cart">
                    <ShoppingCart/>
                </MobileNavigationItem>

                <MobileNavigationItem href="/dashboard">
                    <Home/>
                </MobileNavigationItem>

                <MobileNavigationItem href="/bill">
                    <FileText/>
                </MobileNavigationItem>

                {isAdmin && (
                    <div className="relative flex items-center justify-center">
                        <div
                            className={`p-3 cursor-pointer ${isManagerListVisible ? 'bg-lime-100 border border-black rounded-xl' : ''}`}
                            onClick={toggleManagerList}
                        >
                            <ChartNoAxesGantt/>
                        </div>

                        {isManagerListVisible && (
                            <div
                                className="absolute -top-40 bottom-14 left-8 right-8 flex flex-col-reverse justify-center items-center border border-stone-300 bg-lime-100 rounded-xl">
                                <div
                                    className="cursor-pointer rounded-xl border border-lime-100 hover:border-stone-300 hover:bg-lime-200">
                                    <MobileNavigationItem href="/menu_manager">
                                        <Grid/>
                                    </MobileNavigationItem>
                                </div>
                                <div
                                    className="cursor-pointer rounded-xl border border-lime-100 hover:border-stone-300 hover:bg-lime-200">
                                    <MobileNavigationItem href="/product_manager">
                                        <Package/>
                                    </MobileNavigationItem>
                                </div>
                                <div
                                    className="cursor-pointer rounded-xl border border-lime-100 hover:border-stone-300 hover:bg-lime-200">
                                    <MobileNavigationItem href="/bill_manager">
                                        <FilePlus/>
                                    </MobileNavigationItem>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    )
}