/// <reference types="cypress" />

Cypress.Commands.add('SaveInvoice', (empty) => {
  
     cy.get('[data-original-button-text="Save"]')
    .scrollIntoView().click()
     cy.get('ul > li:nth-child(1) > button').click()

      })

Cypress.Commands.add('CheckAlert', (alert) => {
  
     cy.get('#alerts').should('contain', alert)


      })
           //nakon svakog dodatog invoice moram da ga obrisem zbog max limita na sajtu
 Cypress.Commands.add('DeleteInvoice', (empty) => {
  
      cy.get('a').contains('Actions').click()
      cy.get('.i_delete').click(0, 0, { force: true })
      cy.get('.save_button').click()
        
    })



describe('Create invoice test', () => 
{
    beforeEach('Login',() => {

        const email = 'tvitermejl61@gmail.com'
        const password = 'plazmeni'
       
        cy.visit('https://invoicely.com/login')
        cy.get('#email').type(email)
        cy.get('#password').type(password)
        cy.get('form').submit().wait(4000)  //nekada sporo loaduje pa izbaci gresku jer ne moze da nadje element    
        cy.get('.css-sa76sr').click()       //zato toliki wait
        cy.get('a').contains('Add New').click()
        cy.get('.i_new_invoice').click()
        cy.get('input[placeholder="Enter Client Name"]').click()
        cy.get('[data-index="0"]').should('be.visible').click()


      })

      it('Quantity - input validation',()=>
      {
        cy.get('.quantity_input > input')
        .should('have.attr','data-input-restriction','number')
        
        cy.get('.quantity_input > input')
        .type('1')
        .should('have.value','1')
        cy.SaveInvoice()
        cy.CheckAlert('Invoice added.')
        cy.DeleteInvoice()

      })

      it('Adding new client - name field is empty',()=>
      {
        cy.get('.close_icon').click(0, 0, { force: true })
        cy.get('.address_to > .form_heading > .right')
        .click()

        cy.get('[placeholder="First Name"]').clear({ force: true })        
        .should('not.have.value')

        cy.get('[form="create_edit_connection_popup"]').click()
        cy.get('.message').should('contain', 'There were errors. Please try again.')

      })

    it('Language field validation',()=>
    {
        cy.get('select[name="statement[language]"]').select('Chinese').should('have.value','zh')

        cy.get('select[name="statement[language]"]').select('English (UK)').should('not.have.value','zh')


        cy.SaveInvoice()

        cy.CheckAlert('Invoice added.')
        cy.DeleteInvoice();

     }) 

     it('Invoice No field - input tekst', ()=>
      {
            cy.get('[name="statement[number]"]').clear()
            .should('be.empty')
  
            cy.get('[name="statement[number]"]')
            .type('test')
            .should('have.value','test')
  
            cy.get('[name="statement[number]"]').clear()
            .type('35')
            .should('not.have.value','test')
         
      })  

      


      it('Invoice No field - input decimal numbers',()=>
      {
         cy.get('[name="statement[number]"]').clear()
        .type('1.2')
        .should('have.value','1.2')
  
        cy.SaveInvoice()

        cy.CheckAlert('Invoice added.')
      
      })

      //stavljam isti broj kao prethodni test da testiram da li mogu da imaju isti id
      //moram obrisati invoice sa id 1.2 pre ponovnog pokretanja testa
      it('Invoice No - alredy exists',()=>
     {

       cy.get('[name="statement[number]"]').clear().type('1.2')
 
       cy.SaveInvoice()
       
       cy.CheckAlert('A statement with this number already exists. Please enter a different statement number.')
 
     })
  
        it('Invoice No field - input negative numbers',()=>
      {

        cy.get('[name="statement[number]"]').clear()
        .type('-1')
        .should('have.value','-1')
  
        cy.SaveInvoice()

        cy.CheckAlert('Invoice added.')
        cy.DeleteInvoice();

      }) 
    
        
        
        it('Validate "Currency" field', ()=>
        {
                
                cy.get('[name="statement[currency]"]')
                .should('have.value','usd')

                cy.get('[name="statement[currency]"]')
                .should('not.have.value','czk')
    
                cy.get('a > .input_addon').
                should('contain','USD')
    
                cy.get('ul:nth-child(4) > li > div > strong > span')
                .should('contain','USD')
    

                cy.get('.td_currency')
                .should('contain','USD')
    
                cy.get('[name="statement[currency]"]')
                .select('Afghan Afghani - AFN')
                .should('have.value','afn')

    
                
                cy.get('a > .input_addon').
                should('contain','AFN')
    
                cy.get('ul:nth-child(4) > li > div > strong > span')
                .should('contain','AFN')
    
                cy.get('.td_currency')
                .should('contain','AFN')

    
                cy.get('[name="statement[currency]"]')
                .select('----------------')
                .should('have.value','null')
    
                cy.get('a > .input_addon').
                should('contain','NULL')
    
                cy.get('ul:nth-child(4) > li > div > strong > span')
                .should('contain','NULL')
    
                cy.get('.td_currency')
                .should('contain','NULL')
    
              
         })

         it('Invoice Draft field - validation',()=>
         {
     
           cy.get('[name="statement[custom_title]"]').clear()
           .should('to.be.empty')
     
           cy.get('[name="statement[custom_title]"]')
           .type('proba')
           .should('have.value','proba')
     
           cy.get('[name="statement[custom_title]"]').clear()
           .type('   ')
           .should('have.value','   ')
     
           cy.get('[name="statement[custom_title]"]').clear()
           .type('1!')
           .should('have.value','1!')
     
           cy.get('[name="statement[custom_title]"]')
           .clear().type('test')
           .should('not.have.value','1!')

           cy.get('[name="statement[custom_title]"]')
           .clear().type('test')
           .should('not.have.value','1!')
           
     
           cy.SaveInvoice()
           cy.CheckAlert('Invoice added.')
           cy.DeleteInvoice();
           //cy.get('#alerts').should('contain', 'Invoice added.')

         })

         it('Description field validation (under title)',()=>
    {
        cy.get('[name="statement[description]"]').clear()
        .should('to.be.empty')

        cy.get('[name="statement[description]"]')
        .type('Testing')
        .should('have.value','Testing')

        cy.get('[name="statement[description]"]').clear()
        .type(' ')
        .should('have.value',' ')

        cy.get('[name="statement[description]"]').clear()
        .type('-1!')
        .should('have.value','-1!')

        

        cy.SaveInvoice()
        cy.CheckAlert('Invoice added.')
        cy.DeleteInvoice();

     })

     it('Edit Business Profile checking link ',()=>
      {
        
        cy.get('.address_from > .form_heading > .right').should('have.attr', 'href', '/settings/business')


      })
     
      it('Validate Date field ',()=>
      {
          cy.get('#datepicker').clear()
          .should('to.be.empty')
  
           cy.get('#datepicker').clear()
           .type('February 15 2021')
           .should('not.have.value','15 February 2021')
  
           cy.get('#datepicker').clear()
           .type('February 16 2021')
           .should('have.value','February 16 2021').click()

           cy.SaveInvoice()
          cy.CheckAlert('Invoice added.')
           cy.DeleteInvoice();
   
      })
      

     

      it('Change business logo checking link ',()=>
      {
        
        cy.get('[href="/settings/graphics"]').should('have.attr', 'target', '_blank')

      })

      it('Validate "Due date" field', ()=>
      {
          cy.get('[name="statement[due]"]').select('After 7 days')
          .should('have.value','7')

          cy.get('[name="statement[due]"]').select('Due on Receipt')
          .should('have.value','0')
  
          cy.get('#datepicker_due_date').should('not.be.visible')
  
      })

      it('Due Date field - select Custom', ()=>
      {
        cy.get('[name="statement[due]"]').select('Custom')
        .should('have.value','custom')
  
        cy.get('#datepicker_due_date').should('be.visible')   

      })

      it('Due Date field Custom - validation',()=>
        {
          cy.get('[name="statement[due]"]').select('Custom')
          .should('have.value','custom')
          
          cy.get('#datepicker_due_date').should('be.visible')   

            cy.get('#datepicker_due_date').clear()
            .should('to.be.empty')
    
            cy.get('#datepicker_due_date')
            .type('testing')
            .should('have.value','testing')
    
             cy.get('#datepicker_due_date').clear()
             .type('February 15 2021')
             .should('not.have.value','15 February 2021')
    
             cy.get('#datepicker_due_date').clear()
             .type('February 16 2021')
             .should('have.value','February 16 2021').click()


        })

        it('Purchase order number - validation',()=>
      {
        
        cy.get('[name="statement_po_number"]')
        .type('4')
        .should('have.value','4')


        cy.SaveInvoice()
        cy.CheckAlert('Invoice added.')
        cy.DeleteInvoice()
         

      })

        it('Adding new client',()=>
        {
          cy.get('.close_icon').click(0, 0, { force: true })
          cy.get('.address_to > .form_heading > .right')
          .click()

          cy.get('.individual > .first')
          .type('marija')
          .should('have.value','marija')
  
          cy.get('[form="create_edit_connection_popup"]').click()
        
          cy.CheckAlert('Client added.')
          
        })

        it('Invoice Note field validation',()=>
        {
            cy.get('.mt40 > textarea').clear()
            .should('to.be.empty')
    
            cy.get('.mt40 > textarea')
            .type('Testing')
            .should('have.value','Testing')
    
            cy.get('.mt40 > textarea').clear()
            .type(' ')
            .should('have.value',' ')
    
            cy.get('.mt40 > textarea').clear()
            .type('-1!')
            .should('have.value','-1!')
  
            cy.SaveInvoice()
            cy.CheckAlert('Invoice added.')
            cy.DeleteInvoice();
    
         })

         it('Item description field validation',()=>
    {
        cy.get(' .item_textarea').clear()
        .should('to.be.empty')

        cy.get(' .item_textarea')
        .type('test')
        .should('have.value','test')

        cy.get(' .item_textarea').clear()
        .type('1@')
        .should('have.value','1@')

        cy.get(' .item_textarea').clear()
        .type('  ')
        .should('have.value','  ')

        cy.SaveInvoice()
        cy.CheckAlert('Invoice added.')
        cy.DeleteInvoice();

     })

     it('Rate field - input number',()=>
    {
      cy.get('[name="statement[item_rate]"]')
      .should('have.attr','data-input-restriction','number')
    
      cy.get('[name="statement[item_rate]"]').clear()
      .type('0.001')
      .should('have.value','0.001')
    
      cy.SaveInvoice()
      cy.CheckAlert('Invoice added.')
      cy.DeleteInvoice();
    
    
    })

    

    it('Unit field - selected Custom option',()=>
    {
      
      cy.get('.unit_lower > .with_addon').select('Custom')
      .should('have.value','custom')

      cy.get('.text_unit_input_css').should('be.visible').type('testing')
      .should('have.value','testing')

      cy.SaveInvoice()
      cy.CheckAlert('Invoice added.')
      cy.DeleteInvoice();

      })

      it('Item  Date button test',()=>
    {
      cy.get('.left > .date').click()
      cy.get('[data-day="27"] > .pika-button').click()
      cy.get('#date_tag_1').should('be.visible')

    })

    it('Add link - validation',()=>
    {
      cy.get('.left > :nth-child(4) > .attach_button').click()
    
      cy.get('.link_ttd').type('test')
      cy.get('.link_url').type('facebook.com')
      cy.get('.dropdown-menu > :nth-child(2) > .form_row > .save_button').click()

      cy.get('.item_textarea').should('contain', 'facebook.com')
    
    })

    it('Adding New Tag',()=>
    {
      cy.get(':nth-child(5) > .attach_button').click()
    
      cy.get(':nth-child(5) > .dropdown-menu > .gray > .new_item').click()

      cy.get('#new_tag_1').type('tag1')
    
      cy.get(':nth-child(5) > .dropdown-menu > .gray > .new_tag_item_form > [style="margin-top: 14px;"] > .save_button')
      .click()  
    
      cy.get('#tag_item_tag_1_2').should('be.visible')


  })

    

  it('Invoice note (Default note) checking link ',()=>
      {
    
        cy.get('.normal > a').should('have.attr', 'href', '/settings/emails/edit/invoice_default_note')

      })

 it('Edit default footer checking link ',()=>
      { 
        cy.get('[style="color:#2676a5; position: absolute;bottom: 65px;"]').should('have.attr', 'href', '/settings/emails/edit/statement_footer')

      })  

      it('Total Tax button - input percentage',()=>
        {
          cy.get('.button_row > .right > :nth-child(2) > .attach_button').click()
          cy.get('#tax_discount_shipping_wrapper > .statement_amount_container > .statement_amount')
          .should('be.visible')

          cy.get(' :nth-child(1) > .attach_button')
          .should('not.be.visible')

          cy.get('.tds_name').type('tax1')
          
          cy.get('#tax_rate_2').should('have.attr','data-input-restriction','percentage')

          cy.get('#tax_rate_2').type('4').should('have.value', '4')

          cy.SaveInvoice()
          cy.CheckAlert('Invoice added.')
          cy.DeleteInvoice();
        })

        it('Total Discount button - input percentage',()=>
        {
          cy.get('.button_row > .right > :nth-child(3) > .attach_button').click()
          cy.get('#tax_discount_shipping_wrapper > .statement_amount_container > .statement_amount')
          .should('be.visible')

          cy.get('.inner > .right > :nth-child(2) > .attach_button')
          .should('not.be.visible')

          cy.get('.tds_name').type('tax1')
          
          cy.get('#discount_rate_2').should('have.attr','data-input-restriction','percentage')

          cy.get('#discount_rate_2').type('4').should('have.value', '4')

          cy.SaveInvoice()
          cy.CheckAlert('Invoice added.')
          cy.DeleteInvoice();
   
        })

        it('Total Shipping button - input number',()=>
        {
          cy.get('.right > :nth-child(4) > .attach_button').click()
          cy.get('#tax_discount_shipping_wrapper > .statement_amount_container > .statement_amount')
          .should('be.visible')

          cy.get('.inner > .right > :nth-child(3) > .attach_button')
          .should('not.be.visible')

          cy.get('.tds_name').type('shipping')
          
          cy.get('#shipping_rate_2').should('have.attr','data-input-restriction','number')

          cy.get('#shipping_rate_2').type('4').should('have.value', '4')

          cy.SaveInvoice()
          cy.CheckAlert('Invoice added.')
          cy.DeleteInvoice();

        })

        it('Item Tax button - input percentage',()=>
        {
          cy.get(':nth-child(1) > .attach_button').click()
          cy.get('.right > :nth-child(1) > .dropdown-menu')
          .should('be.visible')
          
          cy.get(':nth-child(1) > .dropdown-menu > .gray > .new_item').click()
        
          cy.get(':nth-child(1) > .dropdown-menu > .gray > .new_tag_item_form > .new_tag_item_input').type('tax1')
          
          cy.get(':nth-child(1) > .dropdown-menu > .gray > .new_tag_item_form > .new_tag_item_rate_input')
          .should('have.attr','data-input-restriction','percentage')

          cy.get(':nth-child(1) > .dropdown-menu > .gray > .new_tag_item_form > .new_tag_item_rate_input')
          .type('4').should('have.value', '4')

          cy.get(':nth-child(1) > .dropdown-menu > .gray > .new_tag_item_form > [style="margin-top: 14px;"] > .save_button')
          .click()

          cy.get('#tag_item_tax_1_2').should('be.visible').and('contain','tax1')
          cy.get('.button_row > .right > :nth-child(2) > .attach_button')
          .should('not.be.visible')

        })

        it('Item Discount button - input percentage',()=>
        {
          cy.get('.inner > .right > :nth-child(2) > .attach_button').click()
          cy.get(':nth-child(2) > .dropdown-menu')
          .should('be.visible')
          
          cy.get(':nth-child(2) > .dropdown-menu > .gray > .new_item').click()
        
          cy.get(':nth-child(2) > .dropdown-menu > .gray > .new_tag_item_form > .new_tag_item_input').type('discount')
          
          cy.get(':nth-child(2) > .dropdown-menu > .gray > .new_tag_item_form > .new_tag_item_rate_input')
          .should('have.attr','data-input-restriction','percentage')

          cy.get(':nth-child(2) > .dropdown-menu > .gray > .new_tag_item_form > .new_tag_item_rate_input')
          .type('4').should('have.value', '4')

          cy.get(':nth-child(2) > .dropdown-menu > .gray > .new_tag_item_form > [style="margin-top: 14px;"] > .save_button')
          .click()

          cy.get('#tag_item_discount_1_2').should('be.visible').and('contain','discount')
          cy.get('.button_row > .right > :nth-child(3) > .attach_button')
          .should('not.be.visible')

        })

        it('Item Shipping button - input number',()=>
        {
          cy.get('.inner > .right > :nth-child(3) > .attach_button').click()
          cy.get(':nth-child(3) > .dropdown-menu')
          .should('be.visible')

          cy.get(':nth-child(3) > .dropdown-menu > .gray > .new_item').click()

          cy.get(':nth-child(3) > .dropdown-menu > .gray > .new_tag_item_form > .new_tag_item_input').type('shipping')
          
          cy.get(':nth-child(3) > .dropdown-menu > .gray > .new_tag_item_form > .new_tag_item_rate_input')
          .should('have.attr','data-input-restriction','number')

          cy.get(':nth-child(3) > .dropdown-menu > .gray > .new_tag_item_form > .new_tag_item_rate_input')
          .type('4').should('have.value', '4')

          cy.get(':nth-child(3) > .dropdown-menu > .gray > .new_tag_item_form > [style="margin-top: 14px;"] > .save_button').click()

          cy.get('#tag_item_shipping_1_2').should('be.visible').and('contain','shipping')

          cy.get('.right > :nth-child(4) > .attach_button')
          .should('not.be.visible')

          cy.SaveInvoice()
          cy.CheckAlert('Invoice added.')
          cy.DeleteInvoice();

        })

        it('Deleting item',()=>
        {
          cy.get('#drag_item_list > .one_item_line').should('be.visible')
          cy.get('.relative > .button').click()
          cy.get('.inner > :nth-child(1) > .relative > .dropdown-menu > :nth-child(1) > a')
          .should('be.visible').click() 
          cy.get('#drag_item_list > .one_item_line').should('not.exist')

        })

        it('Save item - new item form',()=>
        {
          
          cy.get('.relative > .button').click()
          cy.get('.inner > :nth-child(1) > .relative > .dropdown-menu > :nth-child(2) > a').click() 
          cy.get('.page > :nth-child(2) > .form_row > input').type('item')
          cy.get('.x_textarea_container > textarea').type('description')
          cy.get(':nth-child(4) > .form_row > input').type('10')
          cy.get('.form_row > .with_addon').select('pc')
          cy.get(':nth-child(6) > .form_row > .save_button').click()

          cy.CheckAlert('Item added.')

        })
        
        it('Adding expense',()=>
        {
          
          cy.get(':nth-child(8) > .new_item').click()
          cy.get(':nth-child(8) > .dropdown-menu > :nth-child(2) > a').click() 
          cy.get('[data-id="2"] > .item_row').should('be.visible')
          cy.get('#item_textarea_2 > .item_textarea').type('expense')
          cy.get('[data-id="2"] > .item_row > .amount > .inner > .total_input > .with_addon').type('100')
          cy.get('.pull-right > .relative > .button').click()
          cy.get('.pull-right > .relative > .dropdown-menu > :nth-child(2) > a').click()
          cy.get('.x_content > header > h1').should('contain', 'New Expense')

          cy.get(':nth-child(3) > .form_row > .save_button').click()

          cy.CheckAlert('Expense added.')

        })

        

        it('Adding mileage',()=>
        {
          
          cy.get(':nth-child(8) > .new_item').click()
          cy.get(':nth-child(8) > .dropdown-menu > :nth-child(3) > a').click() 
          cy.get('[data-id="2"] > .item_row').should('be.visible')
          cy.get('#item_textarea_2 > .item_textarea').type('mileage')
          cy.get('[data-id="2"] > .item_row > .quantity > .inner > .quantity_input > input').type('100')
          .should('have.value','100')
          cy.get('.unit_input > .with_addon').clear().type('1').should('have.value','1')
          cy.get('.pull-right > .relative > .button').click()
          cy.get('.pull-right > .relative > .dropdown-menu > :nth-child(2) > a').click()
          cy.get('.x_content > header > h1').should('contain', 'New Trip')

          cy.get(':nth-child(4) > .form_row > .save_button').click()

          cy.CheckAlert('Trip added.')

        })

        it('Adding task',()=>
        {
          
          cy.get(':nth-child(8) > .new_item').click()
          cy.get(':nth-child(8) > .dropdown-menu > :nth-child(4) > a').click() 
          cy.get('[data-id="2"] > .item_row').should('be.visible')
          cy.get('#item_textarea_2 > .item_textarea').type('task')
          cy.get('[data-id="2"] > .item_row > .quantity > .inner > .quantity_input > input').clear().type('10:10')
          .should('have.value','10:10')
          cy.get('.unit_input > .with_addon').clear().type('1').should('have.value','1')
          cy.get('.pull-right > .relative > .button').click()
          cy.get('.pull-right > .relative > .dropdown-menu > :nth-child(2) > a').click()
          cy.get('.x_content > header > h1').should('contain', 'New Task')

          cy.get(':nth-child(4) > .form_row > .save_button').click()

          cy.CheckAlert('Task added.')

        })

        it('"Invoice Settings, Payment & Delivery" button - redirection test',()=>
        {
          cy.get('footer > .button').click()
          
          cy.contains('Invoice Settings')
      
            })   

            it('Create invoice - E2E',()=>
        {
          cy.get('.title > input').clear().type('Title').should('have.value','Title')
          cy.get('.statement_description > textarea').clear().type('description').should('have.value','description')
          cy.get('.max_100').clear().type('123').should('have.value','123')
          cy.get('.language_select > select').select('English (UK)').should('have.value','en-uk')
          cy.get('.currency_select > select').select('Afghan Afghani - AFN').should('have.value','afn')

          cy.get('.left > .date').click(0, 0, { force: true })
          cy.get('[data-day="27"] > .pika-button').click()
          cy.get('#date_tag_1').should('be.visible')
          
          cy.get('[name="statement[due]"]').select('After 7 days')
          .should('have.value','7')   
          cy.get('.statement_details > :nth-child(3) > input').type('3').should('have.value','3')
          cy.get('.item_textarea').type('description').should('have.value','description')
          cy.get('.quantity_input > input').type('123').should('have.value','123')
          cy.get('[name="statement[item_rate]"]').clear().type('0.1').should('have.value','0.1')
          cy.get('.unit_lower > .with_addon').select('lb.').should('have.value','lb')
          cy.get('.item_autocomplete > .autocomplete-suggestion').click(0, 0, { force: true })
          
          cy.get('.left > :nth-child(4) > .attach_button').click()
          cy.get('.link_ttd').type('test')
          cy.get('.link_url').type('facebook.com')
          cy.get('.dropdown-menu > :nth-child(2) > .form_row > .save_button').click()
          cy.get('.item_textarea').should('contain', 'facebook.com')

          cy.get(':nth-child(5) > .attach_button').click()
          cy.get(':nth-child(5) > .dropdown-menu > .gray > .new_item').click()
          cy.get('#new_tag_1').type('tag1')
          cy.get(':nth-child(5) > .dropdown-menu > .gray > .new_tag_item_form > [style="margin-top: 14px;"] > .save_button')
          .click()  
          cy.get('#tag_item_tag_1_2').should('be.visible')

          cy.get(':nth-child(8) > .new_item').click()
          cy.get(':nth-child(8) > .dropdown-menu > :nth-child(2) > a').click() 
          cy.get('[data-id="2"] > .item_row').should('be.visible')
          cy.get('#item_textarea_2 > .item_textarea').type('expense')
          cy.get('[data-id="2"] > .item_row > .amount > .inner > .total_input > .with_addon').type('100')

          cy.get(':nth-child(8) > .new_item').click()
          cy.get(':nth-child(8) > .dropdown-menu > :nth-child(3) > a').click() 
          cy.get('[data-id="2"] > .item_row').should('be.visible')
          cy.get('#item_textarea_3 > .item_textarea').type('mileage')
          cy.get('[data-id="3"] > .item_row > .quantity > .inner > .quantity_input > input').type('100')
          .should('have.value','100')
          cy.get('[data-id="3"] > .item_row > .unit > .inner > .unit_input > .with_addon').clear().type('1').should('have.value','1')
          
          cy.get(':nth-child(8) > .new_item').click(0, 0, { force: true })
          cy.get(':nth-child(8) > .dropdown-menu > :nth-child(4) > a').click() 
          cy.get('[data-id="4"] > .item_row').should('be.visible')
          cy.get('#item_textarea_4 > .item_textarea').type('task')
          cy.get('[data-id="4"] > .item_row > .quantity > .inner > .quantity_input > input').clear().type('10:10')
          .should('have.value','10:10')
          cy.get('[data-id="4"] > .item_row > .unit > .inner > .unit_input > .with_addon').clear().type('1').should('have.value','1')

          cy.get('.button_row > .right > :nth-child(2) > .attach_button').click()
          cy.get('#tax_discount_shipping_wrapper > .statement_amount_container > .statement_amount')
          .should('be.visible')
          cy.get(' :nth-child(1) > .attach_button')
          .should('not.be.visible')
          cy.get('.tax > .statement_amount > .second > [style=""] > .tds_name').type('tax1')
          cy.get('#tax_rate_2').should('have.attr','data-input-restriction','percentage')
          cy.get('#tax_rate_2').type('4').should('have.value', '4')

          cy.get('.button_row > .right > :nth-child(3) > .attach_button').click()
          cy.get('.discount > .statement_amount')
          .should('be.visible')
          cy.get('.discount > .statement_amount > .second > [style=""] > .tds_name').type('tax1')
          cy.get('#discount_rate_3').should('have.attr','data-input-restriction','percentage')
          cy.get('#discount_rate_3').type('10').should('have.value', '10')

          cy.get('.button_row > .right > :nth-child(4) > .attach_button').click()
          cy.get('.shipping > .statement_amount')
          .should('be.visible')
          cy.get('.shipping > .statement_amount > .second > [style=""] > .tds_name').type('tax1')
          cy.get('#shipping_rate_4').should('have.attr','data-input-restriction','number')
          cy.get('#shipping_rate_4').type('10').should('have.value', '10')

          cy.get('#datepicker').clear()
          .type('February 16 2021')
          .should('have.value','February 16 2021')  

         
          cy.SaveInvoice()
          cy.CheckAlert('Invoice added.')
          cy.DeleteInvoice();
          
      
            })   

      

        



})