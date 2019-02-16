/*
Zerlin
TCSS 491 - Computational Worlds
Joshua Atherton, Michael Josten, Steven Golob
*/

var PHI = 1.618;

Constants = {
    DroidBasicConstants : {
        BASIC_DROID_SHOOT_INTERVAL : 2,
        BASIC_DROID_X_MOVEMENT_SPEED : 150,
        BASIC_DROID_Y_MOVEMENT_SPEED : 100,
        BASIC_DROID_X_ACCELERATION : 60,
        BASIC_DROID_Y_ACCELERATION : 60,
        BASIC_DROID_ORBITAL_X_OFFSET : 200,
        BASIC_DROID_ORBITAL_Y_OFFSET : -200,

        //Laser constants
        BASIC_DROID_LASER_SPEED : 400, 
        BASIC_DROID_LASER_LENGTH : 10,
        BASIC_DROID_LASER_WIDTH : 10,

        /* leggy droid constants */
        LEGGY_DROID_SHOOT_INTERVAL : 4,
        LEGGY_DROID_LASER_SPEED : 350, 
        LEGGY_DROID_LASER_LENGTH : 25,
        LEGGY_DROID_LASER_WIDTH : 12,

        SPRAY_LASER_COUNT : 5,
        SPRAY_LASER_WIDTH_RADIANS : Math.PI / 6,


        /* beam droid constants */
        BEAM_DROID_SHOOT_INTERVAL : 6,
        BEAM_DROID_SHOOT_DURATION : 2,
        BEAM_DROID_LASER_WIDTH : 16,
        BEAM_HP_PER_SECOND : 3,
        BEAM_ANGLE_ACCELERATION_RADIANS : Math.PI / 3,

        /* slowburst laser constants */
        SLOWBURST_DROID_SHOOT_INTERVAL : .3,
        SLOWBURST_DROID_LASER_SPEED : 350,
        SLOWBURST_DROID_BURSTS : 4,
        // (how many shots are SKIPPED) + BURST_DROID_BURSTS in overall interval
        SLOWBURST_DROID_SHOOTS_PER_CYCLE : 20,

        /* fast burst laser constants */
        FASTBURST_DROID_SHOOT_INTERVAL : .1,
        FASTBURST_DROID_LASER_SPEED : 550,
        FASTBURST_DROID_BURSTS : 3,
        // (how many shots are SKIPPED) + BURST_DROID_BURSTS in overall interval
        FASTBURST_DROID_SHOOTS_PER_CYCLE : 80,

        /* Sniper droid laser constants */
        SNIPER_DROID_LASER_SPEED : 850,
        SNIPER_DROID_SHOOT_INTERVAL : 7,
        SNIPER_DROID_LASER_LENGTH : 50,
        SNIPER_DROID_LASER_WIDTH : 15,

        /* multi-shot laser constants */
        MULTISHOT_DROID_SHOOT_INTERVAL : 2,
        MULTISHOT_WIDTH : 35,
    },

    ZerlinConstants : {
        //PHI : 1.618,

        Z_SCALE : PHI - 1,

        DRAW_COLLISION_BOUNDRIES : false,

        Z_WIDTH : 114,
        Z_HEIGHT : 306,
        Z_ARM_SOCKET_X : 33,
        Z_ARM_SOCKET_Y : 146,
        Z_CROUCH_ARM_SOCKET_Y : 186,
        Z_HORIZANTAL_POSITION : 2 - PHI,
        Z_FEET_ABOVE_FRAME : 10,

        Z_WALKING_FRAME_SPEED : .16,
        Z_WALKING_FRAMES : 6,
        Z_STANDING_FRAME_SPEED : .55,
        Z_STANDING_FRAMES : 2,

        Z_FALLING_UP_FRAMES : 1,
        Z_FALLING_DOWN_FRAMES : 2,
        Z_FALLING_FRAME_SPEED : .16,

        Z_SOMERSAULT_WIDTH : 462,
        Z_SOMERSAULT_HEIGHT : 306,
        Z_SOMERSAULT_FRAME_SPEED : .1,
        Z_SOMERSAULT_FRAMES : 10,

        Z_SLASH_WIDTH : 558,
        Z_SLASH_HEIGHT : 390,
        Z_SLASH_FRAME_SPEED : .04,
        Z_SLASH_FRAMES : 20,
        Z_ARM_SOCKET_X_SLASH_FRAME : 69,
        Z_ARM_SOCKET_Y_SLASH_FRAME : 230,
        Z_SLASH_RADIUS : 280,
        Z_SLASH_CENTER_X : 202,
        Z_SLASH_CENTER_Y : 110,
        Z_SLASH_INNER_RADIUS : 180,
        Z_SLASH_INNER_CENTER_X : 86,
        Z_SLASH_INNER_CENTER_Y : 20,
        Z_SLASH_START_FRAME : 9,
        Z_SLASH_END_FRAME : 11,

        Z_WALKING_SPEED : 150,
        Z_SOMERSAULT_SPEED : 400,
        FORCE_JUMP_DELTA_Y : -950,
        JUMP_DELTA_Y : -500,
        GRAVITATIONAL_ACCELERATION : 1000,

        /* Zerlin health and force stats*/
        Z_MAX_HEALTH : 20,
        Z_MAX_FORCE : 20,
    },

    DroidUtilConstants: {
        EXPLOSION_SCALE : 2,
        EXPLOSION_FRAME_SPEED : 0.05
    },

    DroidSmartConstants: {

    },

    GameEngineConstants: {
        //PHI : 1.618
    },

    SceneManagerConstants: {
        //probably the scene manager file will hold the constants for the different scenes
    },

    CollisionManagerConstants: {
        EDGE_OF_MAP_BUFFER : 50
    },

    SoundEnginerConstants: {

    },

    StatusBarConstants: {
        STATUS_BAR_LENGTH : 0.25, // width of the canvas to use when drawing
        STATUS_BAR_WIDTH : 20,
        STATUS_BAR_DISPLAY_TEXT : true,

        //when the current is less than or equal to the maxSize * CriticalAmount 
        //then start alerting the user by using some graphics.
        STATUS_BAR_CRITICAL_AMOUNT : 0.2, //when the current is at 1/5 the maxSize
        STATUS_BAR_CRITICAL_FLASH_INTERVAL : 0.5,
        HEALTH_BAR_HAS_CRITICAL_STATE : true,
        FORCE_BAR_HAS_CRITICAL_STATE : false,
    },

    CameraConstants: {
        ZERLIN_POSITION_ON_SCREEN : .382, // = (1 - 1/PHI)
        BUFFER : 20
    },

    LevelConstants: {
        DRAW_BOXES : false
    },

    PowerUpConstants: {

    }

};