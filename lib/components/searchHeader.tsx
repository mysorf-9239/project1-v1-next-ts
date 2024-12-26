export default function SearchHeader({title, holder}: {title: string, holder: string}) {

    return (
        <div className="absolute top-0 left-0 w-full h-20 p-10 mt-2 flex flex-col items-start justify-center space-y-2">
            <h2 className="text-2xl font-bold fa">{title}</h2>

            <div className="w-full flex justify-start items-center border p-2 space-x-2 rounded-xl">
                <span className="fa fa-search"></span>
                <input
                    type="search"
                    placeholder={holder}
                    className="w-full focus:outline-none focus:shadow-none"
                    onChange={(e) => {
                        console.log(e)
                    }}
                />
            </div>
        </div>
    )
}