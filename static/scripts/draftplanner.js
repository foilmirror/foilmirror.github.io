$(document).ready(function() {
    loadData()

    $("#addmon").click(addMon)

    $("#moninput").keyup(searchBox)

    $("#searchlist").on("click",".searchlist_pokemon",function() {
        select_pokemon($(this))
    })

    $("#teamlist").on("click",".team_mon",function() {
        $(".activemon").removeClass('activemon')
        $(this).addClass('activemon')
        pokemon=$(this).find(".top_mon_name").text()
        update_table_data(pokemon)
    })

    $("#deleteactivemon").click(function() {
        if ($(".team_mon").length > 1){
            $(".activemon").remove()
            //console.log($(".team_mon"))
            newmon=$(".team_mon").last()
            newmon.addClass('activemon')
            newname=newmon.find(".top_mon_name").text()
            update_table_data(newname)
            update_team_details()
        }
    })

    $("#resetbtn").click(reset_team)

    $("#generation").change(loadData)
})

function loadData(){
    jQuery.ajaxSetup({async:false});
    var gen=$('#generation').val()

    $("#moninput").val('');
    $("#moninput").keyup(searchBox);
    $("#searchlist").empty();


    $.get( "https://foilmirror.github.io/static/data/data.json", function( data ) {
        $.each(data, function(i, item) {
            appendPokemon(item,gen)
        })
    });

    activemon=$(".activemon").first()
    name=activemon.find(".top_mon_name").text()
    update_table_data(name)

    update_team_details()

    jQuery.ajaxSetup({async:true})
}

function addMon(){
    $(".activemon").removeClass("activemon")
    montoadd=$(".addedmon_template").first().clone()
    montoadd.removeClass("addedmon_template").addClass("activemon").addClass("team_mon")
    $("#addmon").before(montoadd);
    update_table_data("")
}

function searchBox(){
    var lookup = $("#moninput").val().toLowerCase()
    $(".searchlist_item").addClass("d-none")
    if (lookup==""){
        $("#searchlist").addClass("d-none")
    } else{
        $("#searchlist").removeClass("d-none")
        $(".searchlist_item").filter(function(){return $(this).text().toLowerCase().includes(lookup)}).removeClass("d-none")
    }
}

function appendPokemon(item,gen){
    var newItem=$("<div class='row searchlist_pokemon searchlist_item d-none border text-dark bg-lightcolor m-0'></div")
    var mon=$("<div class='pokemonname col-3 text-center d-flex justify-content-center align-items-center'></div")
    mon.append("<img class='smallimage monimage' src='"+item.sprite+"'>"+item.name)
    newItem.addClass(classify("pokemon",item.name))
    newItem.append(mon)
    var types=$("<div class='rowtypes col-1 d-flex align-items-center text-center justify-content-center'></div>")
    $.each(item.data.types, function(i, type) {
        types.append("<img src='/static/images/type_images/"+type+".png'>")
        newItem.addClass(classify("type",type))
    })
    newItem.append(types)
    var abilities=$("<div class='rowabilities col-3 d-flex justify-content-center align-items-center text-center'></div>")
    abilities.append(item.data.abilities.join(", "))
    newItem.append(abilities)
    $.each(item.data.abilities, function(i, ability) {
        newItem.addClass(classify("ability",ability))
    })
    var basestats=$("<div class='col-3'></div>")
    basestats.append("<div><table class='table table-sm text-center my-auto'><tr class='rowstats'><td>"+item.data.basestats.hp+"</td><td>"+item.data.basestats.attack+"</td><td>"+item.data.basestats.defense+"</td><td>"+item.data.basestats.special_attack+"</td><td>"+item.data.basestats.special_defense+"</td><td class='monspeed'>"+item.data.basestats.speed+"</td><td>"+item.data.basestats.bst+"</td></tr></table></div>")
    newItem.append(basestats)
    var usefulmoves=$("<div class='rowmoves col-2 d-flex justify-content-center align-items-center text-center'></div>")
    useful=[]
    //listing prio here is too much
    //usefulmoveslist=["Stealth Rock","Spikes","Toxic Spikes","Sticky Web","Defog","Rapid Spin","Court Change","Heal Bell","Aromatherapy","Wish","Fake Out","Extreme Speed","First Impression","Accelrock","Aqua Jet","Bullet Punch","Ice Shard","Mach Punch","Quick Attack","Shadow Sneak","Sucker Punch","Vacuum Wave","Water Shuriken","U-turn","Volt Switch","Parting Shot","Teleport","Flip Turn","Knock Off"]
    usefulmoveslist=["Stealth Rock","Spikes","Toxic Spikes","Sticky Web","Defog","Rapid Spin","Court Change","Mortal Spin","Tidy Up","Heal Bell","Aromatherapy","Wish","Fake Out","Shed Tail","U-turn","Volt Switch","Parting Shot","Flip Turn","Chilly Reception","Knock Off"]
    if(gen == "gen8" || gen == "gen9") {
      usefulmoveslist.push("Teleport")
    }

    //DEX CUT WORKAROUND!!!!!!!!!!!
    if(gen == "gen9" && item.data.movesets[gen].length == 0) {
        gen = "gen8"
    }
    if(gen == "gen8" && item.data.movesets[gen].length == 0) {
        gen = "gen7"
    }

    $.each(item.data.movesets[gen], function(i, move) {
        newItem.addClass(classify("move",move))
        if(usefulmoveslist.includes(move)){
            useful.push(move)
        }
    })

    usefulstring=useful.join(", ")
    if (usefulstring==""){usefulstring="-"}
    usefulmoves.append(usefulstring)
    newItem.append(usefulmoves)
    for (let t in item.data.type_effectiveness) {
        newItem.addClass(t.toLowerCase()+item.data.type_effectiveness[t])
    }
    $("#searchlist").append(newItem)
}

function classify(prefix,suffix){
    let newsuffix = suffix.toLowerCase()
    return prefix + "-" + suffix.replace(/ /g,"").replace(/:/g,"").replace(/%/g,"").replace(".","").replace("'","").toLowerCase()
}

function select_pokemon(selectedmon){
    //hide stuff
    $("#searchlist").addClass("d-none")
    //get data
    activemon=$(".activemon").first()
    //update active mon
    newimage=selectedmon.find('.monimage').attr("src")
    currentimg=activemon.find('img').attr("src", newimage);
    activemon.removeClass("nomonselected")
    newname=selectedmon.find('.pokemonname').text()
    activemon.find('.top_mon_name').text(newname)
    //update table data
    update_table_data(newname)
    update_team_details()
}

function update_table_data(pokemon){
    $("#moninput").val(pokemon)

    if (pokemon==""){
        $("#tableimg").attr("src", "/static/images/defaultsprite.png")
        $("#typingbox").html("-")
        $("#abilitybox").html("-")
        $("#statbox").html("<td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td>")
        $("#movesbox").html("-")
    } else{
        datarow=$("."+classify("pokemon",pokemon))
        newimg=datarow.find('.monimage').attr("src")
        $("#tableimg").attr("src", newimg)

        newtyping=datarow.find(".rowtypes").html()
        $("#typingbox").html(newtyping)

        newabilities=datarow.find(".rowabilities").html()
        $("#abilitybox").html(newabilities)

        newstats=datarow.find(".rowstats").html()
        $("#statbox").html(newstats)

        newmoves=datarow.find(".rowmoves").html()
        $("#movesbox").html(newmoves)
    }
}

function update_team_details(){
    $(".teamdata").text("")
    team=$(".top_mon_name")
    speeds=[]

    $.each(team, function(i, item) {
        pokemon=$(item).text()
        if(pokemon!=""){
            data=$("."+classify("pokemon",pokemon))
            img=data.find('.monimage')
            classList=data.attr('class').split(/\s+/);
            $.each(classList, function(index, item_) {
                if (item_ == "ability-dryskin" || item_ == "ability-waterabsorb" || item_ == "ability-stormdrain") {
                  $(`#teaminfo td.${"water3"}`).append(img.clone())
                  $(`#teaminfo td.${"water3"}`).append("*")
                }
                if (item_ == "ability-flashfire") {
                  $(`#teaminfo td.${"fire3"}`).append(img.clone())
                  $(`#teaminfo td.${"fire3"}`).append("*")
                }
                if (item_ == "ability-sapsipper") {
                  $(`#teaminfo td.${"grass3"}`).append(img.clone())
                  $(`#teaminfo td.${"grass3"}`).append("*")
                }
                if (item_ == "ability-lightningrod" || item_ == "ability-voltabsorb" || item_ == "ability-motordrive") {
                  $(`#teaminfo td.${"electric3"}`).append(img.clone())
                  $(`#teaminfo td.${"electric3"}`).append("*")
                }
                if (item_ == "ability-levitate" || item_ == "ability-eartheater") {
                  $(`#teaminfo td.${"ground3"}`).append(img.clone())
                  $(`#teaminfo td.${"ground3"}`).append("*")
                }
                if (item_ == "ability-purifyingsalt") {
                  $(`#teaminfo td.${"ghost1"}`).append(img.clone())
                  $(`#teaminfo td.${"ghost1"}`).append("*")
                }

                $(`#teaminfo td.${item_}`).append(img.clone())
            })
            speed=data.find(".monspeed").text()
            speeds.push(speed)
            if (speed <= 30){
                $('#speed30').append(img.clone())
            } else if (speed <= 50){
                $('#speed50').append(img.clone())
            } else if (speed <= 70){
                $('#speed70').append(img.clone())
            } else if (speed <= 90){
                $('#speed90').append(img.clone())
            }else if (speed <= 110){
                $('#speed110').append(img.clone())
            } else{
                $('#speedfast').append(img.clone())
            }
        }
    })
    if (speeds.length > 1) {
        speeds=speeds.sort((a, b) => a - b)
        maxdiff=0
        for (let i = 0; i < speeds.length-1; i++) {
            diff=speeds[i+1]-speeds[i]
            if(diff>maxdiff){maxdiff=diff}
        }
        $("#speedgap").text(maxdiff)
    }
}

function reset_team(){
  $(".team_mon").each(function(e){
      $(this).remove()
  });
  addMon()
  update_team_details()
}
